-- Run this once in Supabase SQL Editor to enable cloud flashcards.
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

alter table public.flashcards enable row level security;
create policy "Users manage their flashcards" on public.flashcards
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
