-- Run this in the Supabase SQL editor.

create table if not exists builds (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  project_name text not null,
  category text,
  status text check (status in ('Planning','In Progress','Shipped','Archived')),
  time_spent text,
  tools_used text[] default '{}',
  learning text,
  thumbnail_url text,
  live_link text,
  repo text,
  owner_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

alter table builds enable row level security;

drop policy if exists "public read" on builds;
create policy "public read" on builds
  for select using (true);

drop policy if exists "owner insert" on builds;
create policy "owner insert" on builds
  for insert with check (auth.uid() = owner_id);

drop policy if exists "owner update" on builds;
create policy "owner update" on builds
  for update using (auth.uid() = owner_id);

drop policy if exists "owner delete" on builds;
create policy "owner delete" on builds
  for delete using (auth.uid() = owner_id);

-- Storage bucket policies — create the `thumbnails` bucket (public) in the Storage UI first.
drop policy if exists "thumbs public read" on storage.objects;
create policy "thumbs public read" on storage.objects
  for select using (bucket_id = 'thumbnails');

drop policy if exists "thumbs auth upload" on storage.objects;
create policy "thumbs auth upload" on storage.objects
  for insert with check (bucket_id = 'thumbnails' and auth.role() = 'authenticated');

drop policy if exists "thumbs auth update" on storage.objects;
create policy "thumbs auth update" on storage.objects
  for update using (bucket_id = 'thumbnails' and auth.role() = 'authenticated');
