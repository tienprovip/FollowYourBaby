-- =============================================================================
-- Migration 0006: care_share_invites table + RLS
-- FollowYourBaby — care sharing invite flow
-- =============================================================================

create table care_share_invites (
  id              uuid primary key default uuid_generate_v4(),
  care_share_id   uuid not null references care_shares(id) on delete cascade,
  token           text not null unique default encode(gen_random_bytes(24), 'hex'),
  invitee_email   text,
  expires_at      timestamptz not null default now() + interval '7 days',
  accepted_at     timestamptz,
  created_at      timestamptz not null default now()
);

create index idx_care_share_invites_care_share_id on care_share_invites(care_share_id);
create index idx_care_share_invites_token         on care_share_invites(token);
create index idx_care_share_invites_invitee_email on care_share_invites(invitee_email);

alter table care_share_invites enable row level security;

-- Resource owner can insert invites for their own care_shares
create policy "care_share_invites: owner insert"
  on care_share_invites for insert
  with check (
    exists (
      select 1 from care_shares cs
      where cs.id = care_share_id
        and (
          (cs.resource_type = 'baby'      and exists (select 1 from babies      where id = cs.resource_id and owner_id = auth.uid()))
          or
          (cs.resource_type = 'pregnancy' and exists (select 1 from pregnancies where id = cs.resource_id and owner_id = auth.uid()))
        )
    )
  );

-- Resource owner can view their own invite tokens
create policy "care_share_invites: owner select"
  on care_share_invites for select
  using (
    exists (
      select 1 from care_shares cs
      where cs.id = care_share_id
        and (
          (cs.resource_type = 'baby'      and exists (select 1 from babies      where id = cs.resource_id and owner_id = auth.uid()))
          or
          (cs.resource_type = 'pregnancy' and exists (select 1 from pregnancies where id = cs.resource_id and owner_id = auth.uid()))
        )
    )
  );

-- Resource owner can delete (revoke) invites
create policy "care_share_invites: owner delete"
  on care_share_invites for delete
  using (
    exists (
      select 1 from care_shares cs
      where cs.id = care_share_id
        and (
          (cs.resource_type = 'baby'      and exists (select 1 from babies      where id = cs.resource_id and owner_id = auth.uid()))
          or
          (cs.resource_type = 'pregnancy' and exists (select 1 from pregnancies where id = cs.resource_id and owner_id = auth.uid()))
        )
    )
  );

-- Anyone who knows the token may accept it (update accepted_at only), if not expired and not already accepted
-- Uses security definer function so the anon/authenticated user can look up by token without
-- needing visibility into other invite columns first.
create or replace function accept_care_share_invite(p_token text)
  returns json
  language plpgsql
  security definer
  set search_path = public
as $$
declare
  v_invite care_share_invites%rowtype;
  v_share  care_shares%rowtype;
begin
  select * into v_invite
  from care_share_invites
  where token = p_token
  limit 1;

  if v_invite.id is null then
    return json_build_object('error', 'Lời mời không tồn tại.');
  end if;

  if v_invite.accepted_at is not null then
    return json_build_object('error', 'Lời mời đã được chấp nhận rồi.');
  end if;

  if v_invite.expires_at < now() then
    return json_build_object('error', 'Lời mời đã hết hạn.');
  end if;

  -- Mark invite accepted
  update care_share_invites
  set accepted_at = now()
  where id = v_invite.id;

  -- Mark care_share accepted
  update care_shares
  set accepted_at = now()
  where id = v_invite.care_share_id
    and grantee_id = auth.uid();

  select * into v_share from care_shares where id = v_invite.care_share_id;

  return json_build_object(
    'care_share_id',  v_invite.care_share_id,
    'resource_type',  v_share.resource_type::text,
    'resource_id',    v_share.resource_id,
    'permission',     v_share.permission::text
  );
end;
$$;
