-- =============================================================================
-- Migration 0003: Storage buckets and RLS policies
-- FollowYourBaby — Supabase data architect
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Buckets
-- ---------------------------------------------------------------------------

-- avatars — public read, authenticated upload
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,  -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- baby-photos — private, authenticated upload, signed URL access
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'baby-photos',
  'baby-photos',
  false,
  10485760,  -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic']
)
on conflict (id) do nothing;

-- ultrasounds — private, authenticated upload, signed URL access
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ultrasounds',
  'ultrasounds',
  false,
  20971520,  -- 20 MB
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'image/dicom']
)
on conflict (id) do nothing;

-- medical-docs — private, authenticated upload, signed URL access
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'medical-docs',
  'medical-docs',
  false,
  20971520,  -- 20 MB
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Storage RLS: avatars (public read, owner write)
-- File path convention: avatars/{user_id}/{filename}
-- ---------------------------------------------------------------------------

create policy "avatars: public read"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars: owner insert"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars: owner update"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars: owner delete"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ---------------------------------------------------------------------------
-- Storage RLS: baby-photos (private — owner or baby care-share can read)
-- File path convention: baby-photos/{baby_id}/{filename}
-- ---------------------------------------------------------------------------

create policy "baby-photos: share read"
  on storage.objects for select
  using (
    bucket_id = 'baby-photos'
    and (
      -- Owner check: baby_id segment matches a baby owned by the caller
      exists (
        select 1 from public.babies
        where id::text = (storage.foldername(name))[1]
          and owner_id = auth.uid()
      )
      or
      -- Care-share check
      exists (
        select 1 from public.care_shares cs
        join public.babies b on b.id = cs.resource_id
        where cs.resource_type = 'baby'
          and cs.resource_id::text = (storage.foldername(name))[1]
          and cs.grantee_id = auth.uid()
          and cs.accepted_at is not null
      )
    )
  );

create policy "baby-photos: owner insert"
  on storage.objects for insert
  with check (
    bucket_id = 'baby-photos'
    and exists (
      select 1 from public.babies
      where id::text = (storage.foldername(name))[1]
        and owner_id = auth.uid()
    )
  );

create policy "baby-photos: owner update"
  on storage.objects for update
  using (
    bucket_id = 'baby-photos'
    and exists (
      select 1 from public.babies
      where id::text = (storage.foldername(name))[1]
        and owner_id = auth.uid()
    )
  );

create policy "baby-photos: owner delete"
  on storage.objects for delete
  using (
    bucket_id = 'baby-photos'
    and exists (
      select 1 from public.babies
      where id::text = (storage.foldername(name))[1]
        and owner_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Storage RLS: ultrasounds (private — owner or pregnancy care-share can read)
-- File path convention: ultrasounds/{pregnancy_id}/{filename}
-- ---------------------------------------------------------------------------

create policy "ultrasounds: share read"
  on storage.objects for select
  using (
    bucket_id = 'ultrasounds'
    and (
      exists (
        select 1 from public.pregnancies
        where id::text = (storage.foldername(name))[1]
          and owner_id = auth.uid()
      )
      or
      exists (
        select 1 from public.care_shares
        where resource_type = 'pregnancy'
          and resource_id::text = (storage.foldername(name))[1]
          and grantee_id = auth.uid()
          and accepted_at is not null
      )
    )
  );

create policy "ultrasounds: owner insert"
  on storage.objects for insert
  with check (
    bucket_id = 'ultrasounds'
    and exists (
      select 1 from public.pregnancies
      where id::text = (storage.foldername(name))[1]
        and owner_id = auth.uid()
    )
  );

create policy "ultrasounds: owner update"
  on storage.objects for update
  using (
    bucket_id = 'ultrasounds'
    and exists (
      select 1 from public.pregnancies
      where id::text = (storage.foldername(name))[1]
        and owner_id = auth.uid()
    )
  );

create policy "ultrasounds: owner delete"
  on storage.objects for delete
  using (
    bucket_id = 'ultrasounds'
    and exists (
      select 1 from public.pregnancies
      where id::text = (storage.foldername(name))[1]
        and owner_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Storage RLS: medical-docs (private — owner only)
-- File path convention: medical-docs/{user_id}/{filename}
-- ---------------------------------------------------------------------------

create policy "medical-docs: owner read"
  on storage.objects for select
  using (
    bucket_id = 'medical-docs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "medical-docs: owner insert"
  on storage.objects for insert
  with check (
    bucket_id = 'medical-docs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "medical-docs: owner update"
  on storage.objects for update
  using (
    bucket_id = 'medical-docs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "medical-docs: owner delete"
  on storage.objects for delete
  using (
    bucket_id = 'medical-docs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
