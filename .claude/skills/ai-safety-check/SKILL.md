---
name: ai-safety-check
description: Audit all AI output paths in FollowYourBaby. Use when user says "kiểm tra AI safety", "audit AI", before shipping any AI feature, or after AI-related code changes. Verifies every Claude response carries a risk_level, every UI rendering AI content shows the "không thay thế bác sĩ" disclaimer, every Edge Function has a fallback for timeouts/errors, and no prompt-injection bait reaches the model. Read-only — reports findings; does not fix.
---

# Skill: ai-safety-check

Audit AI safety posture across the FollowYourBaby codebase. Output a findings report.

## What to check

### 1. Edge Functions — server side

For each function under `supabase/functions/ai-*/`:

- Does the function return a `risk_level: "green" | "yellow" | "red"` field?
- Does it have a **fallback path** if Claude times out or returns malformed content? (Static safe response, never an empty body.)
- Is the system prompt explicit that Claude must **not diagnose** and should escalate red flags?
- Is the user's medical/PII data minimized before being sent to Claude (e.g., no full name, no national ID)?
- Are prompt-injection vectors guarded? User-controlled fields like baby name, notes, symptoms must be wrapped or escaped in the prompt — never concatenated into instructions.
- Is `ANTHROPIC_API_KEY` only read via `Deno.env.get` and never logged?

Search for: `supabase/functions/ai-*/index.ts`, look for `risk_level`, `anthropic`, `fetch.*api.anthropic`, `catch`, `AbortController`.

### 2. Client UI — every place AI content is rendered

For each component that displays AI output:

- Is the `AIDisclaimer` (or equivalent "Thông tin từ AI, không thay thế bác sĩ") shown adjacent to the content?
- Is the `risk_level` mapped to a visible badge (green/yellow/red)?
- Is there a fallback UI when the response is missing or the call failed?
- Is the AI content visually distinguishable from doctor/expert content (if any exists)?

Search for: `components/ai/`, components using `useChat`, `useAISummary`, `useAIRisk`, or invoking `supabase.functions.invoke("ai-*")`.

### 3. Cross-cutting

- **AI memory storage**: if there's an `ai_memory` or `ai_context` table, confirm RLS scopes it to the user/baby and the data stored is the minimum (no raw chat transcripts beyond N days).
- **Children's data**: any AI call about a baby under 1 year should NOT make confident medical claims. Verify the system prompt enforces this.
- **Logging**: no Edge Function logs the full Claude response or the user input to `console.log` in a way that lands in Supabase logs.

## Report format

Output a single markdown report grouped by severity:

```
## AI Safety Audit — <date>

### 🔴 Critical (fix before ship)
- <file:line> — what's missing, why it matters, suggested fix

### 🟡 Warnings
- ...

### 🟢 OK
- <function/component> — all checks pass

### Notes
- Coverage: <N> Edge Functions, <M> UI components audited
- Gaps: <e.g. no AIDisclaimer primitive exists yet>
```

## How to run

1. Use Grep to find all matches; do NOT read every file — read only the suspicious matches.
2. Confirm presence of `risk_level` in response types and rendering paths.
3. Check `components/ui/AIDisclaimer.tsx` exists; if not, that itself is a 🔴 finding.
4. Trace one full path end-to-end (Edge Function → hook → component) for spot verification.

## Don't

- Don't auto-fix issues — this is a read-only audit. Hand off to the relevant feature agent for fixes.
- Don't flag green findings as warnings — keep severity meaningful.
- Don't audit non-AI paths; this skill is scoped to AI.
