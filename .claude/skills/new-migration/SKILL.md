---
name: new-migration
description: Scaffold a new Supabase migration for FollowYourBaby. Use when the user asks to add a new table, alter schema, add an index/enum/policy, or "tạo migration mới". Generates the SQL file under supabase/migrations/, enforces RLS-by-default, and regenerates types/database.ts. Do NOT use for one-off DB queries — only for schema changes that must be checked in.
---

# Skill: new-migration

Scaffold a new Supabase migration that follows FollowYourBaby conventions.

## Pre-flight

1. Confirm `supabase/migrations/` exists. If not, suggest running `supabase-architect` agent first.
2. Read the latest migration in `supabase/migrations/` to understand current schema state — do NOT redefine tables that already exist.
3. Ask the user (if not given): table name(s), columns + types, foreign-key relationships, and whether this is **owner-only** or **share-care visible** (impacts RLS).

## Migration file

Path: `supabase/migrations/<YYYYMMDDHHMMSS>_<short_snake_name>.sql`

Use Postgres timestamp prefix — get it from PowerShell: `Get-Date -Format "yyyyMMddHHmmss"`.

## Mandatory rules

- **Table names**: `snake_case`, plural (`baby_profiles`, `feed_logs`).
- **Primary key**: `id uuid primary key default gen_random_uuid()`.
- **Audit columns**: every table gets `created_at timestamptz not null default now()` and `updated_at timestamptz not null default now()` plus an `update_updated_at` trigger.
- **Soft delete only when needed**: prefer hard delete; if soft delete is required, use `deleted_at timestamptz`.
- **Foreign keys**: always `on delete cascade` for owner relationships (`user_id`, `baby_id`, `pregnancy_id`); `on delete set null` for optional refs.
- **RLS is mandatory**: every new table MUST end with `alter table <name> enable row level security;` and at least one policy. No exceptions.
- **Share-care tables**: tables that hold baby/pregnancy data must check the `care_permissions` table for view/edit access, not just `auth.uid() = user_id`. Use a helper function like `has_baby_access(baby_id, 'view' | 'edit' | 'full')` — create one if it doesn't exist yet.

## RLS policy template

```sql
-- Owner-only (user's own data, e.g. user_settings):
create policy "<table>_owner_select" on <table>
  for select using (auth.uid() = user_id);
create policy "<table>_owner_modify" on <table>
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Share-care visible (baby/pregnancy data):
create policy "<table>_caregiver_select" on <table>
  for select using (has_baby_access(baby_id, 'view'));
create policy "<table>_caregiver_insert" on <table>
  for insert with check (has_baby_access(baby_id, 'edit'));
create policy "<table>_caregiver_update" on <table>
  for update using (has_baby_access(baby_id, 'edit'));
create policy "<table>_caregiver_delete" on <table>
  for delete using (has_baby_access(baby_id, 'full'));
```

## After writing the migration

1. Apply locally: `supabase db reset` (warn user — this wipes local data; `supabase migration up` if they want non-destructive).
2. Regenerate types: `supabase gen types typescript --local > types/database.ts`.
3. Run `npx tsc --noEmit` to confirm no type errors leak into the app.
4. Report: file path, tables/columns added, RLS posture (owner-only vs share-care), and any TODOs (seed data, indexes to add later).

## Don't

- Don't grant `service_role` access in policies — that bypasses RLS entirely.
- Don't use `for all using (true)` — that's an open table.
- Don't put PII in column names (`ssn`, `national_id`) without explicit user confirmation.
- Don't add indexes preemptively — only add when you know a query needs it.
