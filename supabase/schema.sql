create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  name text not null,
  progress integer not null default 0 check (progress between 0 and 100),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.topics enable row level security;
create policy "Users manage their profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users manage their subjects" on public.subjects for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their topics" on public.topics for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
