-- =============================================================================
-- Migration 0001: Extensions, Enums, Tables, FKs, Indexes
-- FollowYourBaby — Supabase data architect
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Shared updated_at trigger function (created once, reused on all tables)
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
  returns trigger
  language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type user_role as enum ('pregnant_mother', 'parent', 'caregiver');

create type pregnancy_status as enum ('active', 'completed', 'lost');

create type care_share_resource as enum ('baby', 'pregnancy');

create type care_share_permission as enum ('view', 'edit', 'full');

create type prenatal_visit_type as enum ('checkup', 'ultrasound', 'test');

create type feed_type as enum ('breast', 'bottle', 'solid');

create type feed_side as enum ('left', 'right', 'both');

create type sleep_kind as enum ('nap', 'night');

create type diaper_kind as enum ('wet', 'dirty', 'both');

create type sex_enum as enum ('male', 'female', 'other');

create type activity_kind as enum ('tummy_time', 'crawl', 'walk', 'play');

create type milestone_category as enum ('motor', 'language', 'cognitive', 'social');

create type ai_message_role as enum ('user', 'assistant', 'system');

create type ai_risk_level as enum ('green', 'yellow', 'red');

create type notification_kind as enum ('feed', 'sleep', 'medication', 'visit', 'insight');

create type notification_status as enum ('pending', 'sent', 'failed', 'cancelled');

create type subscription_plan as enum ('free', 'premium', 'family');

create type subscription_status as enum ('active', 'cancelled', 'expired', 'trialing', 'past_due');

-- ---------------------------------------------------------------------------
-- profiles (extends auth.users)
-- ---------------------------------------------------------------------------
create table profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text,
  avatar_url      text,
  role            user_role,
  phone           text,
  locale          text not null default 'vi',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

create index idx_profiles_role on profiles(role);

-- ---------------------------------------------------------------------------
-- pregnancies
-- ---------------------------------------------------------------------------
create table pregnancies (
  id          uuid primary key default uuid_generate_v4(),
  owner_id    uuid not null references profiles(id) on delete cascade,
  due_date    date,
  lmp_date    date,
  status      pregnancy_status not null default 'active',
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger trg_pregnancies_updated_at
  before update on pregnancies
  for each row execute function set_updated_at();

create index idx_pregnancies_owner_id    on pregnancies(owner_id);
create index idx_pregnancies_status      on pregnancies(status);
create index idx_pregnancies_created_at  on pregnancies(created_at);

-- ---------------------------------------------------------------------------
-- babies
-- ---------------------------------------------------------------------------
create table babies (
  id                uuid primary key default uuid_generate_v4(),
  owner_id          uuid not null references profiles(id) on delete cascade,
  name              text not null,
  dob               date not null,
  sex               sex_enum,
  birth_weight_g    int,
  birth_length_cm   numeric(5,2),
  photo_url         text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger trg_babies_updated_at
  before update on babies
  for each row execute function set_updated_at();

create index idx_babies_owner_id   on babies(owner_id);
create index idx_babies_created_at on babies(created_at);

-- ---------------------------------------------------------------------------
-- care_shares
-- ---------------------------------------------------------------------------
create table care_shares (
  id              uuid primary key default uuid_generate_v4(),
  resource_type   care_share_resource not null,
  resource_id     uuid not null,
  grantee_id      uuid not null references profiles(id) on delete cascade,
  permission      care_share_permission not null default 'view',
  created_at      timestamptz not null default now(),
  accepted_at     timestamptz,
  unique (resource_type, resource_id, grantee_id)
);

create index idx_care_shares_grantee_id   on care_shares(grantee_id);
create index idx_care_shares_resource     on care_shares(resource_type, resource_id);
create index idx_care_shares_accepted_at  on care_shares(accepted_at);

-- ---------------------------------------------------------------------------
-- baby_health_profile
-- ---------------------------------------------------------------------------
create table baby_health_profile (
  baby_id         uuid primary key references babies(id) on delete cascade,
  allergies       jsonb not null default '[]',
  medications     jsonb not null default '[]',
  medical_history jsonb not null default '[]',
  updated_at      timestamptz not null default now()
);

create trigger trg_baby_health_profile_updated_at
  before update on baby_health_profile
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- pregnancy_weights
-- ---------------------------------------------------------------------------
create table pregnancy_weights (
  id              uuid primary key default uuid_generate_v4(),
  pregnancy_id    uuid not null references pregnancies(id) on delete cascade,
  owner_id        uuid not null references profiles(id) on delete cascade,
  recorded_at     timestamptz not null default now(),
  weight_kg       numeric(5,2) not null,
  note            text,
  created_at      timestamptz not null default now()
);

create index idx_pregnancy_weights_pregnancy_id on pregnancy_weights(pregnancy_id);
create index idx_pregnancy_weights_owner_id     on pregnancy_weights(owner_id);
create index idx_pregnancy_weights_recorded_at  on pregnancy_weights(recorded_at);

-- ---------------------------------------------------------------------------
-- kick_counts
-- ---------------------------------------------------------------------------
create table kick_counts (
  id              uuid primary key default uuid_generate_v4(),
  pregnancy_id    uuid not null references pregnancies(id) on delete cascade,
  owner_id        uuid not null references profiles(id) on delete cascade,
  started_at      timestamptz not null,
  ended_at        timestamptz,
  count           int not null default 0,
  note            text,
  created_at      timestamptz not null default now()
);

create index idx_kick_counts_pregnancy_id on kick_counts(pregnancy_id);
create index idx_kick_counts_owner_id     on kick_counts(owner_id);
create index idx_kick_counts_started_at   on kick_counts(started_at);

-- ---------------------------------------------------------------------------
-- pregnancy_symptoms
-- ---------------------------------------------------------------------------
create table pregnancy_symptoms (
  id              uuid primary key default uuid_generate_v4(),
  pregnancy_id    uuid not null references pregnancies(id) on delete cascade,
  owner_id        uuid not null references profiles(id) on delete cascade,
  recorded_at     timestamptz not null default now(),
  symptom_key     text not null,
  severity        int check (severity between 1 and 5),
  note            text,
  created_at      timestamptz not null default now()
);

create index idx_pregnancy_symptoms_pregnancy_id on pregnancy_symptoms(pregnancy_id);
create index idx_pregnancy_symptoms_owner_id     on pregnancy_symptoms(owner_id);
create index idx_pregnancy_symptoms_recorded_at  on pregnancy_symptoms(recorded_at);

-- ---------------------------------------------------------------------------
-- prenatal_visits
-- ---------------------------------------------------------------------------
create table prenatal_visits (
  id              uuid primary key default uuid_generate_v4(),
  pregnancy_id    uuid not null references pregnancies(id) on delete cascade,
  owner_id        uuid not null references profiles(id) on delete cascade,
  scheduled_at    timestamptz not null,
  type            prenatal_visit_type not null default 'checkup',
  location        text,
  notes           text,
  document_url    text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger trg_prenatal_visits_updated_at
  before update on prenatal_visits
  for each row execute function set_updated_at();

create index idx_prenatal_visits_pregnancy_id on prenatal_visits(pregnancy_id);
create index idx_prenatal_visits_owner_id     on prenatal_visits(owner_id);
create index idx_prenatal_visits_scheduled_at on prenatal_visits(scheduled_at);

-- ---------------------------------------------------------------------------
-- pregnancy_medications
-- ---------------------------------------------------------------------------
create table pregnancy_medications (
  id              uuid primary key default uuid_generate_v4(),
  pregnancy_id    uuid not null references pregnancies(id) on delete cascade,
  owner_id        uuid not null references profiles(id) on delete cascade,
  name            text not null,
  dosage          text,
  schedule        jsonb not null default '{}',
  started_at      date,
  ended_at        date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger trg_pregnancy_medications_updated_at
  before update on pregnancy_medications
  for each row execute function set_updated_at();

create index idx_pregnancy_medications_pregnancy_id on pregnancy_medications(pregnancy_id);
create index idx_pregnancy_medications_owner_id     on pregnancy_medications(owner_id);

-- ---------------------------------------------------------------------------
-- feed_logs
-- ---------------------------------------------------------------------------
create table feed_logs (
  id          uuid primary key default uuid_generate_v4(),
  baby_id     uuid not null references babies(id) on delete cascade,
  owner_id    uuid not null references profiles(id) on delete cascade,
  started_at  timestamptz not null,
  ended_at    timestamptz,
  type        feed_type not null,
  amount_ml   numeric(7,2),
  side        feed_side,
  food_items  text[],
  note        text,
  created_at  timestamptz not null default now()
);

create index idx_feed_logs_baby_id    on feed_logs(baby_id);
create index idx_feed_logs_owner_id   on feed_logs(owner_id);
create index idx_feed_logs_started_at on feed_logs(started_at);
create index idx_feed_logs_created_at on feed_logs(created_at);

-- ---------------------------------------------------------------------------
-- sleep_logs
-- ---------------------------------------------------------------------------
create table sleep_logs (
  id          uuid primary key default uuid_generate_v4(),
  baby_id     uuid not null references babies(id) on delete cascade,
  owner_id    uuid not null references profiles(id) on delete cascade,
  started_at  timestamptz not null,
  ended_at    timestamptz,
  kind        sleep_kind not null,
  note        text,
  created_at  timestamptz not null default now()
);

create index idx_sleep_logs_baby_id    on sleep_logs(baby_id);
create index idx_sleep_logs_owner_id   on sleep_logs(owner_id);
create index idx_sleep_logs_started_at on sleep_logs(started_at);
create index idx_sleep_logs_created_at on sleep_logs(created_at);

-- ---------------------------------------------------------------------------
-- diaper_logs
-- ---------------------------------------------------------------------------
create table diaper_logs (
  id          uuid primary key default uuid_generate_v4(),
  baby_id     uuid not null references babies(id) on delete cascade,
  owner_id    uuid not null references profiles(id) on delete cascade,
  recorded_at timestamptz not null default now(),
  kind        diaper_kind not null,
  note        text,
  created_at  timestamptz not null default now()
);

create index idx_diaper_logs_baby_id     on diaper_logs(baby_id);
create index idx_diaper_logs_owner_id    on diaper_logs(owner_id);
create index idx_diaper_logs_recorded_at on diaper_logs(recorded_at);
create index idx_diaper_logs_created_at  on diaper_logs(created_at);

-- ---------------------------------------------------------------------------
-- growth_logs
-- ---------------------------------------------------------------------------
create table growth_logs (
  id          uuid primary key default uuid_generate_v4(),
  baby_id     uuid not null references babies(id) on delete cascade,
  owner_id    uuid not null references profiles(id) on delete cascade,
  recorded_at timestamptz not null default now(),
  weight_g    int,
  length_cm   numeric(5,2),
  head_cm     numeric(5,2),
  note        text,
  created_at  timestamptz not null default now()
);

create index idx_growth_logs_baby_id     on growth_logs(baby_id);
create index idx_growth_logs_owner_id    on growth_logs(owner_id);
create index idx_growth_logs_recorded_at on growth_logs(recorded_at);
create index idx_growth_logs_created_at  on growth_logs(created_at);

-- ---------------------------------------------------------------------------
-- symptom_logs
-- ---------------------------------------------------------------------------
create table symptom_logs (
  id          uuid primary key default uuid_generate_v4(),
  baby_id     uuid not null references babies(id) on delete cascade,
  owner_id    uuid not null references profiles(id) on delete cascade,
  recorded_at timestamptz not null default now(),
  fever_c     numeric(4,1),
  symptom_key text,
  severity    int check (severity between 1 and 5),
  note        text,
  created_at  timestamptz not null default now()
);

create index idx_symptom_logs_baby_id     on symptom_logs(baby_id);
create index idx_symptom_logs_owner_id    on symptom_logs(owner_id);
create index idx_symptom_logs_recorded_at on symptom_logs(recorded_at);
create index idx_symptom_logs_created_at  on symptom_logs(created_at);

-- ---------------------------------------------------------------------------
-- medication_logs
-- ---------------------------------------------------------------------------
create table medication_logs (
  id          uuid primary key default uuid_generate_v4(),
  baby_id     uuid not null references babies(id) on delete cascade,
  owner_id    uuid not null references profiles(id) on delete cascade,
  name        text not null,
  dosage      text,
  given_at    timestamptz not null default now(),
  note        text,
  created_at  timestamptz not null default now()
);

create index idx_medication_logs_baby_id    on medication_logs(baby_id);
create index idx_medication_logs_owner_id   on medication_logs(owner_id);
create index idx_medication_logs_given_at   on medication_logs(given_at);
create index idx_medication_logs_created_at on medication_logs(created_at);

-- ---------------------------------------------------------------------------
-- activity_logs
-- ---------------------------------------------------------------------------
create table activity_logs (
  id              uuid primary key default uuid_generate_v4(),
  baby_id         uuid not null references babies(id) on delete cascade,
  owner_id        uuid not null references profiles(id) on delete cascade,
  recorded_at     timestamptz not null default now(),
  kind            activity_kind not null,
  duration_min    int,
  note            text,
  created_at      timestamptz not null default now()
);

create index idx_activity_logs_baby_id     on activity_logs(baby_id);
create index idx_activity_logs_owner_id    on activity_logs(owner_id);
create index idx_activity_logs_recorded_at on activity_logs(recorded_at);
create index idx_activity_logs_created_at  on activity_logs(created_at);

-- ---------------------------------------------------------------------------
-- milestones
-- ---------------------------------------------------------------------------
create table milestones (
  id          uuid primary key default uuid_generate_v4(),
  baby_id     uuid not null references babies(id) on delete cascade,
  owner_id    uuid not null references profiles(id) on delete cascade,
  key         text not null,
  category    milestone_category not null,
  achieved_at date,
  note        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (baby_id, key)
);

create trigger trg_milestones_updated_at
  before update on milestones
  for each row execute function set_updated_at();

create index idx_milestones_baby_id    on milestones(baby_id);
create index idx_milestones_owner_id   on milestones(owner_id);
create index idx_milestones_category   on milestones(category);
create index idx_milestones_created_at on milestones(created_at);

-- ---------------------------------------------------------------------------
-- milestone_catalog (public reference data — no owner_id)
-- ---------------------------------------------------------------------------
create table milestone_catalog (
  key               text primary key,
  category          milestone_category not null,
  age_min_months    int not null,
  age_max_months    int not null,
  title_vi          text not null,
  description_vi    text not null
);

create index idx_milestone_catalog_category on milestone_catalog(category);
create index idx_milestone_catalog_age      on milestone_catalog(age_min_months, age_max_months);

-- ---------------------------------------------------------------------------
-- articles (public knowledge base — no owner_id)
-- ---------------------------------------------------------------------------
create table articles (
  id              uuid primary key default uuid_generate_v4(),
  slug            text not null unique,
  title_vi        text not null,
  body_md_vi      text not null,
  tags            text[] not null default '{}',
  age_min_months  int,
  age_max_months  int,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger trg_articles_updated_at
  before update on articles
  for each row execute function set_updated_at();

create index idx_articles_slug        on articles(slug);
create index idx_articles_tags        on articles using gin(tags);
create index idx_articles_age         on articles(age_min_months, age_max_months);
create index idx_articles_published   on articles(published_at);
create index idx_articles_created_at  on articles(created_at);

-- ---------------------------------------------------------------------------
-- ai_conversations
-- ---------------------------------------------------------------------------
create table ai_conversations (
  id              uuid primary key default uuid_generate_v4(),
  owner_id        uuid not null references profiles(id) on delete cascade,
  baby_id         uuid references babies(id) on delete set null,
  pregnancy_id    uuid references pregnancies(id) on delete set null,
  title           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger trg_ai_conversations_updated_at
  before update on ai_conversations
  for each row execute function set_updated_at();

create index idx_ai_conversations_owner_id     on ai_conversations(owner_id);
create index idx_ai_conversations_baby_id      on ai_conversations(baby_id);
create index idx_ai_conversations_pregnancy_id on ai_conversations(pregnancy_id);
create index idx_ai_conversations_created_at   on ai_conversations(created_at);

-- ---------------------------------------------------------------------------
-- ai_messages
-- ---------------------------------------------------------------------------
create table ai_messages (
  id                uuid primary key default uuid_generate_v4(),
  conversation_id   uuid not null references ai_conversations(id) on delete cascade,
  role              ai_message_role not null,
  content           text not null,
  risk_level        ai_risk_level,
  citations         jsonb,
  created_at        timestamptz not null default now()
);

create index idx_ai_messages_conversation_id on ai_messages(conversation_id);
create index idx_ai_messages_created_at      on ai_messages(created_at);
create index idx_ai_messages_risk_level      on ai_messages(risk_level);

-- ---------------------------------------------------------------------------
-- ai_memory
-- ---------------------------------------------------------------------------
create table ai_memory (
  id              uuid primary key default uuid_generate_v4(),
  owner_id        uuid not null references profiles(id) on delete cascade,
  baby_id         uuid references babies(id) on delete set null,
  pregnancy_id    uuid references pregnancies(id) on delete set null,
  key             text not null,
  value           jsonb not null default '{}',
  source          text,
  created_at      timestamptz not null default now(),
  unique (owner_id, key)
);

create index idx_ai_memory_owner_id     on ai_memory(owner_id);
create index idx_ai_memory_baby_id      on ai_memory(baby_id);
create index idx_ai_memory_pregnancy_id on ai_memory(pregnancy_id);
create index idx_ai_memory_created_at   on ai_memory(created_at);

-- ---------------------------------------------------------------------------
-- notification_schedules
-- ---------------------------------------------------------------------------
create table notification_schedules (
  id              uuid primary key default uuid_generate_v4(),
  owner_id        uuid not null references profiles(id) on delete cascade,
  kind            notification_kind not null,
  payload         jsonb not null default '{}',
  scheduled_at    timestamptz not null,
  sent_at         timestamptz,
  status          notification_status not null default 'pending',
  created_at      timestamptz not null default now()
);

create index idx_notification_schedules_owner_id     on notification_schedules(owner_id);
create index idx_notification_schedules_scheduled_at on notification_schedules(scheduled_at);
create index idx_notification_schedules_status       on notification_schedules(status);
create index idx_notification_schedules_created_at   on notification_schedules(created_at);

-- ---------------------------------------------------------------------------
-- expo_push_tokens
-- ---------------------------------------------------------------------------
create table expo_push_tokens (
  id              uuid primary key default uuid_generate_v4(),
  owner_id        uuid not null references profiles(id) on delete cascade,
  token           text not null unique,
  device_info     jsonb not null default '{}',
  last_seen_at    timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

create index idx_expo_push_tokens_owner_id    on expo_push_tokens(owner_id);
create index idx_expo_push_tokens_token       on expo_push_tokens(token);
create index idx_expo_push_tokens_last_seen   on expo_push_tokens(last_seen_at);

-- ---------------------------------------------------------------------------
-- subscriptions
-- ---------------------------------------------------------------------------
create table subscriptions (
  id                        uuid primary key default uuid_generate_v4(),
  owner_id                  uuid not null references profiles(id) on delete cascade,
  plan                      subscription_plan not null default 'free',
  status                    subscription_status not null default 'active',
  started_at                timestamptz not null default now(),
  expires_at                timestamptz,
  provider                  text,
  provider_subscription_id  text,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  unique (owner_id)
);

create trigger trg_subscriptions_updated_at
  before update on subscriptions
  for each row execute function set_updated_at();

create index idx_subscriptions_owner_id   on subscriptions(owner_id);
create index idx_subscriptions_status     on subscriptions(status);
create index idx_subscriptions_expires_at on subscriptions(expires_at);
