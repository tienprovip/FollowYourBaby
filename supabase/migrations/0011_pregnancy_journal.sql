-- =============================================================================
-- Migration 0011: Pregnancy journal entries
-- FollowYourBaby — personal diary for pregnancy journey
-- =============================================================================

create table pregnancy_journal_entries (
  id              uuid primary key default uuid_generate_v4(),
  pregnancy_id    uuid not null references pregnancies(id) on delete cascade,
  owner_id        uuid not null references profiles(id) on delete cascade,
  recorded_at     timestamptz not null default now(),
  title           text,
  content         text not null,
  mood            text,
  created_at      timestamptz not null default now()
);

create index on pregnancy_journal_entries(pregnancy_id);
create index on pregnancy_journal_entries(owner_id);
create index on pregnancy_journal_entries(recorded_at desc);

alter table pregnancy_journal_entries enable row level security;

-- SELECT: owner or shared viewer
create policy "pregnancy_journal_entries: share select"
  on pregnancy_journal_entries for select
  using (owner_id = auth.uid() or has_resource_access('pregnancy', pregnancy_id, 'view'));

-- INSERT: owner only
create policy "pregnancy_journal_entries: owner insert"
  on pregnancy_journal_entries for insert
  with check (owner_id = auth.uid());

-- UPDATE: owner or shared editor
create policy "pregnancy_journal_entries: owner or edit update"
  on pregnancy_journal_entries for update
  using (owner_id = auth.uid() or has_resource_access('pregnancy', pregnancy_id, 'edit'))
  with check (owner_id = auth.uid() or has_resource_access('pregnancy', pregnancy_id, 'edit'));

-- DELETE: owner only
create policy "pregnancy_journal_entries: owner delete"
  on pregnancy_journal_entries for delete
  using (owner_id = auth.uid());
