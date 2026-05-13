---
name: rls-audit
description: Audit Row-Level Security across the Supabase schema. Use when user says "kiểm tra RLS", "audit phân quyền", before any data-touching feature ships, or after schema migrations. Verifies every public table has RLS enabled, has at least one policy, share-care tables use has_baby_access() (not just user_id ownership), no policies use unrestricted `using (true)`, and helper functions are SECURITY DEFINER only when justified. Read-only — outputs findings report.
---

# Skill: rls-audit

Audit Row-Level Security across the FollowYourBaby Supabase schema.

## What to check

### 1. Every public table has RLS enabled

Scan all migrations under `supabase/migrations/` and confirm each `create table public.<name>` is followed (in the same or later migration) by:

```sql
alter table public.<name> enable row level security;
```

Tables WITHOUT this line are a 🔴 finding — they're wide open to anyone with the anon key.

### 2. Every table has at least one policy

A table with RLS enabled but zero policies is effectively locked (denies everything). That's usually a bug — find tables that compile but have no policies and flag as 🟡.

### 3. Owner-only vs share-care correctness

Tables that store **baby/pregnancy data** (`feed_logs`, `sleep_logs`, `weight_logs`, `kick_logs`, `prenatal_visits`, `milestones_achieved`, `growth_logs`, etc.) must reference a share-care helper, not just `auth.uid() = user_id`. Look for:

```sql
-- ✅ correct
using (has_baby_access(baby_id, 'view'))

-- 🔴 wrong — co-caregivers can't access
using (auth.uid() = user_id)
```

Tables that store **user-only settings** (`user_settings`, `push_tokens`, `subscriptions`) should use `auth.uid() = user_id` and NOT go through `has_baby_access`.

### 4. Open / unsafe policies

Flag any of these patterns:

- `using (true)` — open table.
- `with check (true)` on INSERT — anyone can write.
- Policies that reference `service_role` to bypass — only acceptable in Edge Functions, never in app-facing policies.
- Policies missing `with check` on `insert` / `update` — caller can write rows they couldn't read.

### 5. Helper function safety

If functions like `has_baby_access(...)` exist:

- They should be `SECURITY DEFINER` so they can read `care_permissions` even when the caller can't.
- The function body must NOT trust caller-supplied user_id; always use `auth.uid()`.
- `search_path` should be set explicitly (`set search_path = public, pg_temp`) to prevent search-path injection.

### 6. Storage buckets

If migrations create storage buckets (ultrasound photos, visit documents):

- Bucket must be `private` (not public).
- Storage policies must scope reads/writes by the user's access to the parent baby/pregnancy.
- File paths should embed `baby_id` / `pregnancy_id` so policies can authorize per-object.

## Report format

```
## RLS Audit — <date>

### Coverage
- <N> tables in schema, <X> with RLS, <Y> with at least one policy

### 🔴 Critical
- table.column — no RLS enabled — anyone with anon key can read/write
- table — policy uses `auth.uid() = user_id` but should use `has_baby_access` — co-caregivers locked out / can't write

### 🟡 Warnings
- table — has RLS but no policies → all access blocked, intentional?
- helper_fn — SECURITY DEFINER without explicit search_path

### 🟢 OK
- <table> — RLS + correct policy pattern

### Storage
- <bucket> — public/private, policy summary
```

## How to run

1. Grep `supabase/migrations/` for `create table` and `enable row level security`. Diff the two lists.
2. For each table, grep for its name across migrations to find associated `create policy` statements.
3. Classify each table as owner-only or share-care based on whether it has `baby_id` / `pregnancy_id`.
4. Verify the classification matches the policy style.

## Don't

- Don't auto-fix — hand findings off to `supabase-architect`.
- Don't run against the live DB (no `psql`) — the migrations are the source of truth here.
- Don't flag dev-only seed migrations as production issues; note them separately.
