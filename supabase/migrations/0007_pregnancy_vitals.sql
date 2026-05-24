-- =============================================================================
-- Migration 0007: pregnancy_vitals — blood pressure, blood sugar, heart rate
-- =============================================================================

create type vital_kind as enum ('blood_pressure', 'blood_sugar', 'heart_rate');

create table pregnancy_vitals (
  id           uuid primary key default uuid_generate_v4(),
  pregnancy_id uuid not null references pregnancies(id) on delete cascade,
  owner_id     uuid not null references auth.users(id) on delete cascade,
  kind         vital_kind not null,
  value1       numeric not null,   -- systolic mmHg / mg/dL / bpm
  value2       numeric,            -- diastolic mmHg (blood_pressure only)
  unit         text not null,
  recorded_at  timestamptz not null default now(),
  note         text,
  created_at   timestamptz not null default now()
);

alter table pregnancy_vitals enable row level security;

create policy "owner can manage vitals"
  on pregnancy_vitals
  for all
  using  (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create index idx_pregnancy_vitals_lookup
  on pregnancy_vitals(pregnancy_id, kind, recorded_at desc);
