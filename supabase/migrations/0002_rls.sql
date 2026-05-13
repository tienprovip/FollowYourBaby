-- =============================================================================
-- Migration 0002: Row Level Security policies
-- FollowYourBaby — Supabase data architect
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Enable RLS on every table
-- ---------------------------------------------------------------------------
alter table profiles                  enable row level security;
alter table pregnancies               enable row level security;
alter table babies                    enable row level security;
alter table care_shares               enable row level security;
alter table baby_health_profile       enable row level security;
alter table pregnancy_weights         enable row level security;
alter table kick_counts               enable row level security;
alter table pregnancy_symptoms        enable row level security;
alter table prenatal_visits           enable row level security;
alter table pregnancy_medications     enable row level security;
alter table feed_logs                 enable row level security;
alter table sleep_logs                enable row level security;
alter table diaper_logs               enable row level security;
alter table growth_logs               enable row level security;
alter table symptom_logs              enable row level security;
alter table medication_logs           enable row level security;
alter table activity_logs             enable row level security;
alter table milestones                enable row level security;
alter table milestone_catalog         enable row level security;
alter table articles                  enable row level security;
alter table ai_conversations          enable row level security;
alter table ai_messages               enable row level security;
alter table ai_memory                 enable row level security;
alter table notification_schedules    enable row level security;
alter table expo_push_tokens          enable row level security;
alter table subscriptions             enable row level security;

-- ---------------------------------------------------------------------------
-- Helper: permission level ordering
-- Returns true when the stored permission satisfies the minimum required.
-- Permission hierarchy: view < edit < full
-- ---------------------------------------------------------------------------
create or replace function permission_gte(stored text, required text)
  returns boolean
  language sql
  immutable
  security definer
as $$
  select case required
    when 'view' then stored in ('view', 'edit', 'full')
    when 'edit' then stored in ('edit', 'full')
    when 'full' then stored = 'full'
    else false
  end;
$$;

-- ---------------------------------------------------------------------------
-- has_resource_access(resource_type, resource_id, min_permission)
-- Returns TRUE when the calling user (auth.uid()) either:
--   1. Owns the resource directly (via pregnancies/babies owner_id), OR
--   2. Has an accepted care_shares entry with sufficient permission.
-- ---------------------------------------------------------------------------
create or replace function has_resource_access(
  p_resource_type text,
  p_resource_id   uuid,
  p_min_perm      text
)
  returns boolean
  language plpgsql
  stable
  security definer
as $$
declare
  v_owner_id uuid;
  v_share_perm text;
begin
  -- 1. Check direct ownership
  if p_resource_type = 'baby' then
    select owner_id into v_owner_id from babies where id = p_resource_id;
  elsif p_resource_type = 'pregnancy' then
    select owner_id into v_owner_id from pregnancies where id = p_resource_id;
  end if;

  if v_owner_id = auth.uid() then
    return true;
  end if;

  -- 2. Check accepted care_share
  select permission::text into v_share_perm
  from care_shares
  where resource_type::text = p_resource_type
    and resource_id = p_resource_id
    and grantee_id  = auth.uid()
    and accepted_at is not null
  limit 1;

  if v_share_perm is not null and permission_gte(v_share_perm, p_min_perm) then
    return true;
  end if;

  return false;
end;
$$;

-- =============================================================================
-- PROFILES
-- =============================================================================

-- Users read their own profile only
create policy "profiles: owner select"
  on profiles for select
  using (id = auth.uid());

-- Users insert their own profile
create policy "profiles: owner insert"
  on profiles for insert
  with check (id = auth.uid());

-- Users update their own profile
create policy "profiles: owner update"
  on profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Grantees need to see sharer profile (for display names etc.)
-- Allow read if the viewer has any accepted care_share from this profile owner
create policy "profiles: care share grantee select"
  on profiles for select
  using (
    exists (
      select 1 from care_shares
      where grantee_id = auth.uid()
        and accepted_at is not null
        and resource_id in (
          select id from babies     where owner_id = profiles.id
          union
          select id from pregnancies where owner_id = profiles.id
        )
    )
  );

-- =============================================================================
-- PREGNANCIES
-- =============================================================================

create policy "pregnancies: owner select"
  on pregnancies for select
  using (owner_id = auth.uid() or has_resource_access('pregnancy', id, 'view'));

create policy "pregnancies: owner insert"
  on pregnancies for insert
  with check (owner_id = auth.uid());

create policy "pregnancies: owner or edit share update"
  on pregnancies for update
  using (owner_id = auth.uid() or has_resource_access('pregnancy', id, 'edit'))
  with check (owner_id = auth.uid() or has_resource_access('pregnancy', id, 'edit'));

create policy "pregnancies: owner delete"
  on pregnancies for delete
  using (owner_id = auth.uid());

-- =============================================================================
-- BABIES
-- =============================================================================

create policy "babies: owner or share select"
  on babies for select
  using (owner_id = auth.uid() or has_resource_access('baby', id, 'view'));

create policy "babies: owner insert"
  on babies for insert
  with check (owner_id = auth.uid());

create policy "babies: owner or edit share update"
  on babies for update
  using (owner_id = auth.uid() or has_resource_access('baby', id, 'edit'))
  with check (owner_id = auth.uid() or has_resource_access('baby', id, 'edit'));

create policy "babies: owner delete"
  on babies for delete
  using (owner_id = auth.uid());

-- =============================================================================
-- CARE_SHARES
-- =============================================================================

-- Owner of the resource can see all shares for their resource
create policy "care_shares: resource owner select"
  on care_shares for select
  using (
    (resource_type = 'baby'      and exists (select 1 from babies      where id = resource_id and owner_id = auth.uid()))
    or
    (resource_type = 'pregnancy' and exists (select 1 from pregnancies where id = resource_id and owner_id = auth.uid()))
    or grantee_id = auth.uid()
  );

create policy "care_shares: resource owner insert"
  on care_shares for insert
  with check (
    (resource_type = 'baby'      and exists (select 1 from babies      where id = resource_id and owner_id = auth.uid()))
    or
    (resource_type = 'pregnancy' and exists (select 1 from pregnancies where id = resource_id and owner_id = auth.uid()))
  );

-- Grantee can accept (set accepted_at), owner can modify
create policy "care_shares: owner or grantee update"
  on care_shares for update
  using (
    grantee_id = auth.uid()
    or
    (resource_type = 'baby'      and exists (select 1 from babies      where id = resource_id and owner_id = auth.uid()))
    or
    (resource_type = 'pregnancy' and exists (select 1 from pregnancies where id = resource_id and owner_id = auth.uid()))
  );

create policy "care_shares: resource owner delete"
  on care_shares for delete
  using (
    (resource_type = 'baby'      and exists (select 1 from babies      where id = resource_id and owner_id = auth.uid()))
    or
    (resource_type = 'pregnancy' and exists (select 1 from pregnancies where id = resource_id and owner_id = auth.uid()))
    or grantee_id = auth.uid()
  );

-- =============================================================================
-- BABY_HEALTH_PROFILE
-- =============================================================================

create policy "baby_health_profile: share select"
  on baby_health_profile for select
  using (has_resource_access('baby', baby_id, 'view'));

create policy "baby_health_profile: owner insert"
  on baby_health_profile for insert
  with check (has_resource_access('baby', baby_id, 'edit'));

create policy "baby_health_profile: edit share update"
  on baby_health_profile for update
  using (has_resource_access('baby', baby_id, 'edit'))
  with check (has_resource_access('baby', baby_id, 'edit'));

create policy "baby_health_profile: owner delete"
  on baby_health_profile for delete
  using (
    exists (select 1 from babies where id = baby_id and owner_id = auth.uid())
  );

-- =============================================================================
-- Macro: pregnancy-linked log tables
-- Tables: pregnancy_weights, kick_counts, pregnancy_symptoms,
--         prenatal_visits, pregnancy_medications
-- Pattern: select via resource_access('pregnancy'), insert/update by owner_id,
--          delete by owner.
-- =============================================================================

-- PREGNANCY_WEIGHTS
create policy "pregnancy_weights: share select"
  on pregnancy_weights for select
  using (owner_id = auth.uid() or has_resource_access('pregnancy', pregnancy_id, 'view'));

create policy "pregnancy_weights: owner insert"
  on pregnancy_weights for insert
  with check (owner_id = auth.uid());

create policy "pregnancy_weights: owner or edit update"
  on pregnancy_weights for update
  using (owner_id = auth.uid() or has_resource_access('pregnancy', pregnancy_id, 'edit'))
  with check (owner_id = auth.uid() or has_resource_access('pregnancy', pregnancy_id, 'edit'));

create policy "pregnancy_weights: owner delete"
  on pregnancy_weights for delete
  using (owner_id = auth.uid());

-- KICK_COUNTS
create policy "kick_counts: share select"
  on kick_counts for select
  using (owner_id = auth.uid() or has_resource_access('pregnancy', pregnancy_id, 'view'));

create policy "kick_counts: owner insert"
  on kick_counts for insert
  with check (owner_id = auth.uid());

create policy "kick_counts: owner or edit update"
  on kick_counts for update
  using (owner_id = auth.uid() or has_resource_access('pregnancy', pregnancy_id, 'edit'))
  with check (owner_id = auth.uid() or has_resource_access('pregnancy', pregnancy_id, 'edit'));

create policy "kick_counts: owner delete"
  on kick_counts for delete
  using (owner_id = auth.uid());

-- PREGNANCY_SYMPTOMS
create policy "pregnancy_symptoms: share select"
  on pregnancy_symptoms for select
  using (owner_id = auth.uid() or has_resource_access('pregnancy', pregnancy_id, 'view'));

create policy "pregnancy_symptoms: owner insert"
  on pregnancy_symptoms for insert
  with check (owner_id = auth.uid());

create policy "pregnancy_symptoms: owner or edit update"
  on pregnancy_symptoms for update
  using (owner_id = auth.uid() or has_resource_access('pregnancy', pregnancy_id, 'edit'))
  with check (owner_id = auth.uid() or has_resource_access('pregnancy', pregnancy_id, 'edit'));

create policy "pregnancy_symptoms: owner delete"
  on pregnancy_symptoms for delete
  using (owner_id = auth.uid());

-- PRENATAL_VISITS
create policy "prenatal_visits: share select"
  on prenatal_visits for select
  using (owner_id = auth.uid() or has_resource_access('pregnancy', pregnancy_id, 'view'));

create policy "prenatal_visits: owner insert"
  on prenatal_visits for insert
  with check (owner_id = auth.uid());

create policy "prenatal_visits: owner or edit update"
  on prenatal_visits for update
  using (owner_id = auth.uid() or has_resource_access('pregnancy', pregnancy_id, 'edit'))
  with check (owner_id = auth.uid() or has_resource_access('pregnancy', pregnancy_id, 'edit'));

create policy "prenatal_visits: owner delete"
  on prenatal_visits for delete
  using (owner_id = auth.uid());

-- PREGNANCY_MEDICATIONS
create policy "pregnancy_medications: share select"
  on pregnancy_medications for select
  using (owner_id = auth.uid() or has_resource_access('pregnancy', pregnancy_id, 'view'));

create policy "pregnancy_medications: owner insert"
  on pregnancy_medications for insert
  with check (owner_id = auth.uid());

create policy "pregnancy_medications: owner or edit update"
  on pregnancy_medications for update
  using (owner_id = auth.uid() or has_resource_access('pregnancy', pregnancy_id, 'edit'))
  with check (owner_id = auth.uid() or has_resource_access('pregnancy', pregnancy_id, 'edit'));

create policy "pregnancy_medications: owner delete"
  on pregnancy_medications for delete
  using (owner_id = auth.uid());

-- =============================================================================
-- Baby-linked log tables
-- Tables: feed_logs, sleep_logs, diaper_logs, growth_logs, symptom_logs,
--         medication_logs, activity_logs
-- Pattern: select via resource_access('baby'), insert/update by owner_id,
--          delete by owner.
-- =============================================================================

-- FEED_LOGS
create policy "feed_logs: share select"
  on feed_logs for select
  using (owner_id = auth.uid() or has_resource_access('baby', baby_id, 'view'));

create policy "feed_logs: owner insert"
  on feed_logs for insert
  with check (owner_id = auth.uid());

create policy "feed_logs: owner or edit update"
  on feed_logs for update
  using (owner_id = auth.uid() or has_resource_access('baby', baby_id, 'edit'))
  with check (owner_id = auth.uid() or has_resource_access('baby', baby_id, 'edit'));

create policy "feed_logs: owner delete"
  on feed_logs for delete
  using (owner_id = auth.uid());

-- SLEEP_LOGS
create policy "sleep_logs: share select"
  on sleep_logs for select
  using (owner_id = auth.uid() or has_resource_access('baby', baby_id, 'view'));

create policy "sleep_logs: owner insert"
  on sleep_logs for insert
  with check (owner_id = auth.uid());

create policy "sleep_logs: owner or edit update"
  on sleep_logs for update
  using (owner_id = auth.uid() or has_resource_access('baby', baby_id, 'edit'))
  with check (owner_id = auth.uid() or has_resource_access('baby', baby_id, 'edit'));

create policy "sleep_logs: owner delete"
  on sleep_logs for delete
  using (owner_id = auth.uid());

-- DIAPER_LOGS
create policy "diaper_logs: share select"
  on diaper_logs for select
  using (owner_id = auth.uid() or has_resource_access('baby', baby_id, 'view'));

create policy "diaper_logs: owner insert"
  on diaper_logs for insert
  with check (owner_id = auth.uid());

create policy "diaper_logs: owner or edit update"
  on diaper_logs for update
  using (owner_id = auth.uid() or has_resource_access('baby', baby_id, 'edit'))
  with check (owner_id = auth.uid() or has_resource_access('baby', baby_id, 'edit'));

create policy "diaper_logs: owner delete"
  on diaper_logs for delete
  using (owner_id = auth.uid());

-- GROWTH_LOGS
create policy "growth_logs: share select"
  on growth_logs for select
  using (owner_id = auth.uid() or has_resource_access('baby', baby_id, 'view'));

create policy "growth_logs: owner insert"
  on growth_logs for insert
  with check (owner_id = auth.uid());

create policy "growth_logs: owner or edit update"
  on growth_logs for update
  using (owner_id = auth.uid() or has_resource_access('baby', baby_id, 'edit'))
  with check (owner_id = auth.uid() or has_resource_access('baby', baby_id, 'edit'));

create policy "growth_logs: owner delete"
  on growth_logs for delete
  using (owner_id = auth.uid());

-- SYMPTOM_LOGS
create policy "symptom_logs: share select"
  on symptom_logs for select
  using (owner_id = auth.uid() or has_resource_access('baby', baby_id, 'view'));

create policy "symptom_logs: owner insert"
  on symptom_logs for insert
  with check (owner_id = auth.uid());

create policy "symptom_logs: owner or edit update"
  on symptom_logs for update
  using (owner_id = auth.uid() or has_resource_access('baby', baby_id, 'edit'))
  with check (owner_id = auth.uid() or has_resource_access('baby', baby_id, 'edit'));

create policy "symptom_logs: owner delete"
  on symptom_logs for delete
  using (owner_id = auth.uid());

-- MEDICATION_LOGS
create policy "medication_logs: share select"
  on medication_logs for select
  using (owner_id = auth.uid() or has_resource_access('baby', baby_id, 'view'));

create policy "medication_logs: owner insert"
  on medication_logs for insert
  with check (owner_id = auth.uid());

create policy "medication_logs: owner or edit update"
  on medication_logs for update
  using (owner_id = auth.uid() or has_resource_access('baby', baby_id, 'edit'))
  with check (owner_id = auth.uid() or has_resource_access('baby', baby_id, 'edit'));

create policy "medication_logs: owner delete"
  on medication_logs for delete
  using (owner_id = auth.uid());

-- ACTIVITY_LOGS
create policy "activity_logs: share select"
  on activity_logs for select
  using (owner_id = auth.uid() or has_resource_access('baby', baby_id, 'view'));

create policy "activity_logs: owner insert"
  on activity_logs for insert
  with check (owner_id = auth.uid());

create policy "activity_logs: owner or edit update"
  on activity_logs for update
  using (owner_id = auth.uid() or has_resource_access('baby', baby_id, 'edit'))
  with check (owner_id = auth.uid() or has_resource_access('baby', baby_id, 'edit'));

create policy "activity_logs: owner delete"
  on activity_logs for delete
  using (owner_id = auth.uid());

-- =============================================================================
-- MILESTONES
-- =============================================================================

create policy "milestones: share select"
  on milestones for select
  using (owner_id = auth.uid() or has_resource_access('baby', baby_id, 'view'));

create policy "milestones: owner insert"
  on milestones for insert
  with check (owner_id = auth.uid());

create policy "milestones: owner or edit update"
  on milestones for update
  using (owner_id = auth.uid() or has_resource_access('baby', baby_id, 'edit'))
  with check (owner_id = auth.uid() or has_resource_access('baby', baby_id, 'edit'));

create policy "milestones: owner delete"
  on milestones for delete
  using (owner_id = auth.uid());

-- =============================================================================
-- MILESTONE_CATALOG — public read, no write from users
-- =============================================================================

create policy "milestone_catalog: public read"
  on milestone_catalog for select
  using (true);

-- =============================================================================
-- ARTICLES — public read for published, no write from users
-- =============================================================================

create policy "articles: public read"
  on articles for select
  using (published_at is not null and published_at <= now());

-- =============================================================================
-- AI_CONVERSATIONS — owner only (no care-share on AI data)
-- =============================================================================

create policy "ai_conversations: owner select"
  on ai_conversations for select
  using (owner_id = auth.uid());

create policy "ai_conversations: owner insert"
  on ai_conversations for insert
  with check (owner_id = auth.uid());

create policy "ai_conversations: owner update"
  on ai_conversations for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "ai_conversations: owner delete"
  on ai_conversations for delete
  using (owner_id = auth.uid());

-- =============================================================================
-- AI_MESSAGES — accessible by conversation owner via conversation lookup
-- =============================================================================

create policy "ai_messages: conversation owner select"
  on ai_messages for select
  using (
    exists (
      select 1 from ai_conversations
      where id = ai_messages.conversation_id
        and owner_id = auth.uid()
    )
  );

create policy "ai_messages: conversation owner insert"
  on ai_messages for insert
  with check (
    exists (
      select 1 from ai_conversations
      where id = conversation_id
        and owner_id = auth.uid()
    )
  );

create policy "ai_messages: conversation owner delete"
  on ai_messages for delete
  using (
    exists (
      select 1 from ai_conversations
      where id = ai_messages.conversation_id
        and owner_id = auth.uid()
    )
  );

-- =============================================================================
-- AI_MEMORY — owner only, no sharing
-- =============================================================================

create policy "ai_memory: owner select"
  on ai_memory for select
  using (owner_id = auth.uid());

create policy "ai_memory: owner insert"
  on ai_memory for insert
  with check (owner_id = auth.uid());

create policy "ai_memory: owner update"
  on ai_memory for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "ai_memory: owner delete"
  on ai_memory for delete
  using (owner_id = auth.uid());

-- =============================================================================
-- NOTIFICATION_SCHEDULES — owner only
-- =============================================================================

create policy "notification_schedules: owner select"
  on notification_schedules for select
  using (owner_id = auth.uid());

create policy "notification_schedules: owner insert"
  on notification_schedules for insert
  with check (owner_id = auth.uid());

create policy "notification_schedules: owner update"
  on notification_schedules for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "notification_schedules: owner delete"
  on notification_schedules for delete
  using (owner_id = auth.uid());

-- =============================================================================
-- EXPO_PUSH_TOKENS — owner only
-- =============================================================================

create policy "expo_push_tokens: owner select"
  on expo_push_tokens for select
  using (owner_id = auth.uid());

create policy "expo_push_tokens: owner insert"
  on expo_push_tokens for insert
  with check (owner_id = auth.uid());

create policy "expo_push_tokens: owner update"
  on expo_push_tokens for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "expo_push_tokens: owner delete"
  on expo_push_tokens for delete
  using (owner_id = auth.uid());

-- =============================================================================
-- SUBSCRIPTIONS — owner only, no sharing
-- =============================================================================

create policy "subscriptions: owner select"
  on subscriptions for select
  using (owner_id = auth.uid());

create policy "subscriptions: owner insert"
  on subscriptions for insert
  with check (owner_id = auth.uid());

create policy "subscriptions: owner update"
  on subscriptions for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "subscriptions: owner delete"
  on subscriptions for delete
  using (owner_id = auth.uid());
