create extension if not exists "uuid-ossp";

-- One row per account. Holds the plan so the free tier limits can be checked.
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Master skill tree definitions. Seeded from lib/skills/catalog.ts (see 002).
create table skill_trees (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  category text not null check (category in ('pull', 'push', 'core', 'legs', 'balance')),
  summary text not null default '',
  sort_order integer not null default 0,
  prerequisites jsonb not null default '[]',   -- [{ slug, level }]
  progressions jsonb not null                  -- [{ level, name, description, prerequisite_reps, target_type, target_value, per_side, cues, common_faults }]
);

create table user_skill_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  skill_tree_id uuid not null references skill_trees(id) on delete cascade,
  current_level integer not null default 0 check (current_level >= 0),
  current_reps_or_hold text,               -- '8 reps' or '15 sec hold'
  current_value numeric,                   -- the number behind it, for readiness
  started_at date not null default current_date,
  last_progress_update date,
  unique(user_id, skill_tree_id)
);

-- Every start, logged attempt, step up and step back. Feeds the timeline chart.
create table progress_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  skill_tree_id uuid not null references skill_trees(id) on delete cascade,
  kind text not null check (kind in ('start', 'attempt', 'advance', 'regress')),
  level integer not null,
  value numeric,
  created_at timestamptz not null default now()
);

create table form_checks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  skill_tree_id uuid references skill_trees(id) on delete cascade,
  skill_level integer not null default 0,
  checked_at timestamptz not null default now(),
  photo_url text,                          -- storage path of the first frame
  photo_paths text[] not null default '{}',
  ai_feedback text,
  form_issues text[] not null default '{}',
  progression_ready boolean,
  next_step_advice text,
  details jsonb                            -- the full structured analysis
);

create table training_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_date date not null,
  skills_trained text[] not null default '{}',   -- skill tree slugs
  notes text,
  location text check (location in ('home', 'outdoor_gym', 'commercial_gym')),
  duration_min integer check (duration_min between 1 and 600),
  rpe integer check (rpe between 1 and 10),
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_progress_user on user_skill_progress(user_id);
create index idx_events_user_tree on progress_events(user_id, skill_tree_id, created_at);
create index idx_checks_user on form_checks(user_id, checked_at desc);
create index idx_sessions_user on training_sessions(user_id, session_date desc);

-- RLS
alter table profiles enable row level security;
alter table skill_trees enable row level security;
alter table user_skill_progress enable row level security;
alter table progress_events enable row level security;
alter table form_checks enable row level security;
alter table training_sessions enable row level security;

-- Read only for the owner. Plan changes happen server side with the service role.
create policy "own_profile_read" on profiles for select using (auth.uid() = id);

create policy "public_skill_trees" on skill_trees for select using (true);
create policy "own_progress" on user_skill_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own_events" on progress_events for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own_checks" on form_checks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own_sessions" on training_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Private bucket for form check frames. Files live under <user_id>/..., and the
-- app only ever hands out short lived signed URLs.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('form-checks', 'form-checks', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "own_form_frames_read" on storage.objects for select
  using (bucket_id = 'form-checks' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own_form_frames_insert" on storage.objects for insert
  with check (bucket_id = 'form-checks' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own_form_frames_delete" on storage.objects for delete
  using (bucket_id = 'form-checks' and (storage.foldername(name))[1] = auth.uid()::text);
