# Sprint 6 — Supabase Edge Functions for AI

Sprint 6 wires Anthropic Claude into FollowYourBaby through **five Supabase Edge Functions**. All AI traffic is server-side; the React Native client only invokes functions via `supabase.functions.invoke()`. The `ANTHROPIC_API_KEY` exists only as a Deno env var inside the function runtime.

---

## 1. Edge Function inventory

| Function | Endpoint | Purpose | Claude usage |
|---|---|---|---|
| `ai-chat` | `POST /functions/v1/ai-chat` | Context-aware chat with full user/baby/pregnancy context. | Sonnet 4.6 (Messages API) |
| `ai-summary` | `POST /functions/v1/ai-summary` | Daily / weekly / monthly digest of tracking data. | Sonnet 4.6 |
| `ai-risk-alert` | `POST /functions/v1/ai-risk-alert` | Deterministic rule-based risk detection; Claude only rephrases. | Sonnet 4.6 (optional rephrase) |
| `ai-week-guidance` | `POST /functions/v1/ai-week-guidance` | Weekly pregnancy content (development, body, tips, warnings). | Sonnet 4.6 |
| `ocr-visit` | `POST /functions/v1/ocr-visit` | Vision-based OCR of prenatal visit documents. | Sonnet 4.6 (vision) |

Existing `create-care-invite` remains unchanged.

### Request / response schemas

**`ai-chat`**
```json
// Request
{ "conversation_id": "uuid|null", "message": "string", "baby_id": "uuid?", "pregnancy_id": "uuid?" }
// Response
{ "conversation_id": "uuid", "reply": "string", "risk_level": "green|yellow|red", "suggestions": ["..."] }
```

**`ai-summary`**
```json
// Request
{ "period": "daily|weekly|monthly", "baby_id": "uuid?", "pregnancy_id": "uuid?", "date": "ISO date?" }
// Response
{ "summary": "markdown", "highlights": ["..."], "risk_level": "green|yellow|red", "action_items": ["..."] }
```

**`ai-risk-alert`**
```json
// Request
{ "baby_id": "uuid?", "pregnancy_id": "uuid?" }
// Response
{ "alerts": [{ "category": "...", "risk_level": "yellow|red", "message": "...", "action": "..." }] }
```

**`ai-week-guidance`**
```json
// Request
{ "pregnancy_id": "uuid", "week": 1..42 }
// Response
{ "week": 24, "fetal_development": "...", "body_changes": "...", "tips": ["..."], "warning_signs": ["..."], "risk_level": "green" }
```

**`ocr-visit`**
```json
// Request
{ "image_base64": "...", "pregnancy_id": "uuid", "media_type": "image/jpeg" }
// Response
{ "extracted": { "visit_date": null, "doctor_name": null, "weight_kg": null, "blood_pressure": null, "fetal_heartbeat": null, "notes": null, "next_visit_date": null }, "confidence": "high|medium|low", "risk_level": "green" }
```

---

## 2. Context building strategy

`_shared/context.ts` exposes one bundler per resource. All queries go through the **user's RLS-scoped client** (`buildAuthedClients` in `_shared/supabase.ts`) so any row leak would mean an RLS bug, not an application bug.

For `ai-chat` the bundle is:

1. `loadProfile` — `full_name`, `role`, `locale`.
2. `loadBabyContext` — last 3 days of feeds/sleeps/diapers, last 5 growth rows, last 3 days of symptoms, recently achieved milestones, overdue milestones (catalog `age_max_months < babyAgeMonths` not in `milestones`).
3. `loadPregnancyContext` — week (from `lmp_date` or `due_date`), last 3 kick sessions, last 3 weight rows, upcoming visits, active medications.
4. `loadMemory` — `ai_memory` rows scoped by `owner_id` (+ optional `baby_id` / `pregnancy_id`) for persistent facts (allergies, preferences).
5. `loadRecentMessages` — last 10 turns of the conversation (excludes `system`).

The system prompt (`prompts.ts → CHAT_SYSTEM_PROMPT`) is concatenated with formatted context sections. Prompts are versioned via `PROMPT_VERSION` so output drift across deployments is traceable.

`ai-summary` reuses the bundlers but additionally aggregates period totals (feed ml, sleep hrs, wet/dirty counts, weight delta, kick totals) and includes those in the user prompt.

`ai-risk-alert` skips Claude entirely for detection — rules in code (see "Risk classification" below). Claude is only invoked to rephrase pre-set messages into warmer Vietnamese; the `risk_level` and `category` returned to the client are always the rule-determined values, never what Claude returned.

---

## 3. Risk classification logic

Two layers:

### Layer 1 — model-declared `risk_level`
Every chat / summary system prompt requires the model to emit a `<meta>{...}</meta>` JSON block including a `risk_level`. `prompts.ts → extractMeta()` parses it out.

### Layer 2 — keyword fallback (`safety.ts → classifyRisk`)
If the meta block is missing/invalid we keyword-classify the reply:

| Level | Vietnamese trigger keywords (lowercased) |
|---|---|
| `red` | khẩn cấp, cấp cứu, nguy hiểm, ngừng thở, co giật, ra máu nhiều, không cử động, tím tái, vỡ ối, sốt cao trên 39, mất ý thức, đau bụng dữ dội, chảy máu nhiều |
| `yellow` | nên gặp bác sĩ, nên đi khám, theo dõi thêm, sốt cao, giảm bú, bú ít, thai máy giảm, bất thường, lưu ý, cẩn trọng |
| `green` | everything else |

Default on parse failure: `yellow` (safe side).

### Rule-based (deterministic) — `ai-risk-alert`
| Rule id | Trigger | risk_level |
|---|---|---|
| `no_feed_4h` | No `feed_logs` in last 4 h (baby < 12 months) | yellow |
| `no_diaper_8h` | No `diaper_logs` in last 8 h | yellow |
| `fever_high` | Any `symptom_logs.fever_c >= 39.0` today | **red** |
| `no_growth_30d` | No `growth_logs` in last 30 days | yellow |
| `milestone_overdue:<key>` | `milestone_catalog.age_max_months < age` AND not achieved | yellow |
| `kick_low_today` | Today's `kick_counts` sum < 10 | yellow |
| `no_kick_2d` | No `kick_counts` in 2 days AND week ≥ 28 | yellow |

`risk_level` and `category` from these rules are **never overwritten by Claude**.

### Disclaimer enforcement
`safety.ts → ensureDisclaimer()` appends `Lưu ý: thông tin trên không thay thế tư vấn bác sĩ...` if neither phrase appears in the reply. Every assistant chat / summary / week-guidance response runs through this.

---

## 4. Security model

### Auth flow
1. Client calls `supabase.functions.invoke('ai-chat', ...)`, which forwards the Supabase JWT in `Authorization: Bearer <jwt>`.
2. `_shared/supabase.ts → buildAuthedClients()`:
   - Creates a user-scoped client (anon key + user JWT header) — **all data reads go through this**, so RLS enforces row ownership / care-share visibility.
   - Creates an admin client (service role) — used **only** for server-authored writes that must succeed regardless of future RLS tweaks (e.g. inserting `ai_messages` rows for the assistant turn, updating `ai_conversations.updated_at`).
3. Validates JWT via `userClient.auth.getUser()`. If invalid → 401.
4. Resource ownership is double-checked by a `select` against `userClient` before any work happens (`ai_conversations` for chat, `babies` / `pregnancies` for the others).

### Key handling
- `ANTHROPIC_API_KEY` is read once per call via `Deno.env.get('ANTHROPIC_API_KEY')` inside `_shared/anthropic.ts`.
- The key is sent only in the `x-api-key` header to `api.anthropic.com`.
- It is never returned in responses, never logged. `safety.ts → redactForLog()` strips any `sk-ant-*` prefix from strings before `console.error` on retry exhaustion.
- The client bundle has no reference to it (grep over `hooks/`, `components/`, `app/`, `lib/`, `stores/` returns zero matches).

### Resilience
- Claude calls have `AbortSignal.timeout(25000)` (25 s) + 3 exponential-backoff retries on 5xx / network errors (`anthropic.ts`).
- On exhausted retries: chat returns a Vietnamese fallback reply (`safety.ts → fallbackReply()`); summary / week-guidance return a safe placeholder; risk-alert falls back to the raw rule-based messages.
- Every error path returns `{ error, risk_level: 'green' }` and an HTTP status — never throws into the response.

### Database
- Existing migrations already define `ai_conversations`, `ai_messages`, `ai_memory` and their RLS policies (`migrations/0001_init.sql` + `0002_rls.sql`). **No new migration required for Sprint 6.**
- `ai_messages` insert via admin client is safe because we verified the conversation belongs to the authenticated user immediately before.

---

## 5. Local testing

### Prerequisites
```powershell
# In repo root .env (already populated except ANTHROPIC_API_KEY)
ANTHROPIC_API_KEY=sk-ant-...
```

### Serve a single function
```powershell
supabase functions serve ai-chat --env-file .env
# or all at once:
supabase functions serve --env-file .env
```

### Get a user JWT for curl
```sql
-- In Supabase Studio SQL editor:
select auth.sign(json_build_object('sub','<user-uuid>','role','authenticated'), '<jwt-secret>');
```
Or just sign in via the app and copy `session.access_token` from `useAuthStore`.

### Smoke test each endpoint
```bash
JWT="..."
BASE="http://localhost:54321/functions/v1"

# 1. ai-chat
curl -X POST "$BASE/ai-chat" \
  -H "Authorization: Bearer $JWT" -H "Content-Type: application/json" \
  -d '{"message":"Bé nhà mình 3 tháng ngủ mấy tiếng là đủ?"}'

# 2. ai-summary
curl -X POST "$BASE/ai-summary" \
  -H "Authorization: Bearer $JWT" -H "Content-Type: application/json" \
  -d '{"period":"daily","baby_id":"<BABY_UUID>"}'

# 3. ai-risk-alert
curl -X POST "$BASE/ai-risk-alert" \
  -H "Authorization: Bearer $JWT" -H "Content-Type: application/json" \
  -d '{"baby_id":"<BABY_UUID>"}'

# 4. ai-week-guidance
curl -X POST "$BASE/ai-week-guidance" \
  -H "Authorization: Bearer $JWT" -H "Content-Type: application/json" \
  -d '{"pregnancy_id":"<PG_UUID>","week":24}'

# 5. ocr-visit (base64 truncated)
curl -X POST "$BASE/ocr-visit" \
  -H "Authorization: Bearer $JWT" -H "Content-Type: application/json" \
  -d '{"pregnancy_id":"<PG_UUID>","image_base64":"<BASE64>","media_type":"image/jpeg"}'
```

### Deploy to production
```powershell
supabase secrets set ANTHROPIC_API_KEY=<value>
supabase functions deploy ai-chat
supabase functions deploy ai-summary
supabase functions deploy ai-risk-alert
supabase functions deploy ai-week-guidance
supabase functions deploy ocr-visit
```

---

## 6. Hand-off to Sprint 7 (AI chat UI)

Sprint 7 will build the chat surface in `app/(tabs)/ai-chat.tsx` and supporting components. It can lean on:

### Hooks already shipped
- **`hooks/useAIChat.ts`** — `useAIChat({ babyId, pregnancyId, initialConversationId })` returns:
  ```ts
  { conversationId, messages, suggestions, isLoading, error, sendMessage, resetConversation }
  ```
  - `messages` is local-only state (no Realtime yet) — Sprint 7 can hydrate from `ai_messages` table on mount if a `conversationId` is passed in.
  - Server-persisted `risk_level` is on the assistant response; UI should render `<AIDisclaimer>` and a colored badge per `risk_level`.

- **`hooks/useAIDailySummary.ts`** — `useAIDailySummary({ babyId, pregnancyId, period, date })` returns:
  ```ts
  { summary, highlights, riskLevel, actionItems, isLoading, error, refetch }
  ```
  - TanStack-Query-cached for 30 min so re-mounts don't re-bill Claude.

### Suggested Sprint 7 UI deliverables
1. `components/ai/AIChatBubble.tsx` — bubble that shows `risk_level` color + disclaimer footer.
2. `components/ai/AISuggestionChips.tsx` — renders `suggestions[]` as tappable chips that call `sendMessage`.
3. `components/ai/AIRiskBadge.tsx` — pill in `brand-mint` / `brand-pink-200` / `brand-pink` for green/yellow/red.
4. `app/(tabs)/ai-chat.tsx` — screen wired to `useAIChat` with active baby/pregnancy from `babyStore`.
5. Dashboard card on `app/(tabs)/index.tsx` showing `useAIDailySummary` output.
6. Conversation list (load from `ai_conversations` table) so users can resume.
7. Wire `ai-risk-alert` into pull-to-refresh on dashboard, or trigger it from a pg_cron + `notification_schedules` flow (covered later by the notification-builder agent).

### Files Sprint 7 should NOT touch
- Anything under `supabase/functions/_shared/` — those are stable contracts.
- The system prompts in `_shared/prompts.ts` — bump `PROMPT_VERSION` if changed, never edit silently.

---

## 7. New files this sprint

```
supabase/functions/
  _shared/
    anthropic.ts        — Claude wrapper (retry + timeout + key handling)
    context.ts          — RLS-scoped context bundlers + prompt formatters
    cors.ts             — Shared CORS / JSON helpers
    prompts.ts          — Versioned Vietnamese system prompts + meta parsers
    safety.ts           — Risk classifier, disclaimer, fallback, log redaction
    supabase.ts         — JWT-scoped client factory
  ai-chat/index.ts
  ai-summary/index.ts
  ai-risk-alert/index.ts
  ai-week-guidance/index.ts
  ocr-visit/index.ts

hooks/
  useAIChat.ts
  useAIDailySummary.ts

.env.example            — Updated with ANTHROPIC_API_KEY and SMS placeholder
```

No new tables, no new migrations.

---

## 8. Sprint checklist sync

Proposed update for `CLAUDE.md`:

- [x] Sprint 6: Xây Supabase Edge Function AI chat và context engine

(Awaits user confirmation per `sprint-sync` workflow.)
