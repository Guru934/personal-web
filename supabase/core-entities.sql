-- Personal OS normalized core entities.
-- Run once after schema.sql. This migration is additive and preserves existing data.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  done boolean not null default false,
  priority text not null default 'Medium' check (priority in ('High','Medium','Low')),
  topic text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null default '',
  topic text not null default 'General',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic text not null,
  minutes integer not null check (minutes > 0),
  started_at timestamptz,
  completed_at timestamptz not null default now()
);

create table if not exists public.flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question text not null,
  answer text not null,
  topic text not null default 'General',
  due text not null default 'Today',
  due_at timestamptz not null default now(),
  last_rating text,
  created_at timestamptz not null default now()
);

create table if not exists public.flashcard_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  flashcard_id uuid not null references public.flashcards(id) on delete cascade,
  confidence integer not null check (confidence between 1 and 5),
  answer text,
  reviewed_at timestamptz not null default now()
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  progress integer not null default 0 check (progress between 0 and 100),
  due_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  days boolean[] not null default '{false,false,false,false,false,false,false}',
  created_at timestamptz not null default now()
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  url text not null,
  topic text not null default 'General',
  progress integer not null default 0 check (progress between 0 and 100),
  created_at timestamptz not null default now()
);

alter table public.tasks enable row level security;
alter table public.notes enable row level security;
alter table public.study_sessions enable row level security;
alter table public.flashcards enable row level security;
alter table public.flashcard_reviews enable row level security;
alter table public.goals enable row level security;
alter table public.habits enable row level security;
alter table public.resources enable row level security;

drop policy if exists "Users manage their tasks" on public.tasks;
create policy "Users manage their tasks" on public.tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users manage their notes" on public.notes;
create policy "Users manage their notes" on public.notes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users manage their study sessions" on public.study_sessions;
create policy "Users manage their study sessions" on public.study_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users manage their flashcards" on public.flashcards;
create policy "Users manage their flashcards" on public.flashcards for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users manage their flashcard reviews" on public.flashcard_reviews;
create policy "Users manage their flashcard reviews" on public.flashcard_reviews for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users manage their goals" on public.goals;
create policy "Users manage their goals" on public.goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users manage their habits" on public.habits;
create policy "Users manage their habits" on public.habits for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users manage their resources" on public.resources;
create policy "Users manage their resources" on public.resources for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
