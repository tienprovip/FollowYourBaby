-- ---------------------------------------------------------------------------
-- ai_daily_usage: server-side daily AI message counter per user
-- Replaces the AsyncStorage-based tracking so usage can be queried/reset
-- from the Supabase dashboard without touching the device.
-- ---------------------------------------------------------------------------

create table if not exists ai_daily_usage (
  user_id    uuid    not null references auth.users(id) on delete cascade,
  usage_date date    not null default current_date,
  count      integer not null default 0 check (count >= 0),
  primary key (user_id, usage_date)
);

alter table ai_daily_usage enable row level security;

create policy "ai_daily_usage: owner select"
  on ai_daily_usage for select
  using (auth.uid() = user_id);

create policy "ai_daily_usage: owner insert"
  on ai_daily_usage for insert
  with check (auth.uid() = user_id);

create policy "ai_daily_usage: owner update"
  on ai_daily_usage for update
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- increment_ai_usage(p_user_id)
-- Upserts the row for today and bumps the count by 1.
-- Called from the client via rpc('increment_ai_usage').
-- ---------------------------------------------------------------------------
create or replace function increment_ai_usage(p_user_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  insert into ai_daily_usage (user_id, usage_date, count)
  values (p_user_id, current_date, 1)
  on conflict (user_id, usage_date)
  do update set count = ai_daily_usage.count + 1
  returning count into v_count;

  return v_count;
end;
$$;

-- ---------------------------------------------------------------------------
-- get_ai_usage_today(p_user_id)
-- Returns today's count (0 if no row yet).
-- ---------------------------------------------------------------------------
create or replace function get_ai_usage_today(p_user_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select count from ai_daily_usage
      where user_id = p_user_id and usage_date = current_date),
    0
  );
$$;
