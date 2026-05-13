---
name: sprint-sync
description: Reconcile the Sprint checklist in CLAUDE.md with what's actually built in the FollowYourBaby codebase. Use when user says "cập nhật sprint", "đồng bộ checklist", "đang ở sprint nào", or at the end of a work session. Inspects folders, migrations, screens, hooks, and Edge Functions to infer completion status, then proposes [x] updates for the checklist. Does NOT auto-edit CLAUDE.md — shows proposed diff for user approval.
---

# Skill: sprint-sync

Reconcile `CLAUDE.md` Sprint checklist with reality.

## Evidence map (item → what to check)

| Checklist item | Evidence in repo |
|---|---|
| Sprint 1: Expo + Supabase setup, email auth | `app/_layout.tsx`, `lib/supabase.ts`, `app/(auth)/login.tsx`, `app/(auth)/register.tsx` exist; `package.json` has expo, @supabase/supabase-js |
| Sprint 1: Onboarding journey + survey | `app/(onboarding)/` group with at least journey + survey screens |
| Sprint 2: Profile + multi-baby + multi-pregnancy | Migrations for `baby_profiles`, `pregnancies`; `app/(tabs)/profile.tsx`; `babyStore.ts` with active-baby/pregnancy switching |
| Sprint 2: Share-care + permissions | Migration for `care_permissions`; UI to invite/manage caregivers; `has_baby_access` helper |
| Sprint 3: Maternal tracking (weight, kick, symptoms) | Migrations for `weight_logs`, `kick_logs`, `symptom_logs`; screens under `app/(tabs)/` or maternal subroute |
| Sprint 4: Baby tracking (feed, sleep, diaper, growth) | Migrations for `feed_logs`, `sleep_logs`, `diaper_logs`, `growth_logs`; tracking screens |
| Sprint 5: Baby profile + milestones + growth charts | `milestone_catalog`, `milestones_achieved` migrations; charts under `components/charts/` |
| Sprint 6: Edge Function ai-chat + context engine | `supabase/functions/ai-chat/index.ts` deployed; context-building logic |
| Sprint 7: AI chat integrated + memory | `app/(tabs)/ai-chat.tsx`; hook calling `supabase.functions.invoke("ai-chat")`; `ai_memory` table |
| Sprint 8: Analytics dashboard + reminders + push | `app/(tabs)/index.tsx` with summary; `supabase/functions/push-notify/`; Expo push token registration |
| Sprint 9: Subscription + premium gating | Migration for `subscriptions`; paywall screen; feature-gate helper |
| Sprint 9: MVP + E2E test | Test files (`__tests__/`, `e2e/`) and a release checklist note |

## How to run

1. Glob for the expected files/folders above. Build a coverage map.
2. For each checklist item, classify:
   - **Done** (all expected artifacts exist + non-trivial): propose `[ ]` → `[x]`
   - **In progress** (some artifacts, some missing): note what's missing, leave unchecked
   - **Not started** (no artifacts): leave unchecked, mention in summary
3. Report a **proposed diff** for the Sprint checklist section of `CLAUDE.md`. Do NOT auto-apply.

## Report format

```
## Sprint Sync — <date>

### Currently active sprint (inferred)
Sprint <N>: <reason>

### Proposed checklist updates (CLAUDE.md)
- [x] Sprint 1: Thiết lập Expo + Supabase, đăng ký email, đăng nhập, đăng xuất
  Evidence: app/(auth)/login.tsx, app/(auth)/register.tsx, lib/supabase.ts

- [ ] Sprint 2: Chia sẻ quyền chăm sóc và phân quyền — IN PROGRESS
  Missing: invite-caregiver UI, has_baby_access helper

### Drift / surprises
- <something exists that doesn't match a sprint, e.g. subscription screen built before sprint 9>

### Next checklist item to tackle
Sprint <N>: <item> — recommended next agent: <agent name>
```

## After the report

If user approves the diff, use `Edit` on `CLAUDE.md` to update only the checkbox lines — do NOT rewrite the whole section.

## Don't

- Don't mark a sprint complete based on a single file existing — require multiple pieces of evidence.
- Don't update CLAUDE.md without user confirmation.
- Don't propose new sprint items that don't already exist in the checklist — that's a scope change, not a sync.
