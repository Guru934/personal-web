-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Tasks table
create table if not exists tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  done boolean default false,
  priority text default 'Medium',
  topic text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Notes table
create table if not exists notes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text,
  topic text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Resources table
create table if not exists resources (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  url text,
  topic text,
  progress integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Goals table with milestones column
create table if not exists goals (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  milestones jsonb default '[]'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Habits table
create table if not exists habits (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  days boolean[] default array[false, false, false, false, false, false, false],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Study sessions table
create table if not exists study_sessions (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users(id) on delete cascade,
  topic text not null,
  minutes integer not null,
  date text not null,
  created_at timestamp with time zone default now()
);

-- Timetable entries table
create table if not exists timetable (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users(id) on delete cascade,
  day_of_week text not null,
  time text not null,
  subject text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Daily review table
create table if not exists daily_reviews (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users(id) on delete cascade,
  date text not null,
  content text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Media table
create table if not exists media (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  url text,
  type text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- AI usage tracking table
create table if not exists ai_usage (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users(id) on delete cascade,
  date text not null,
  credits_used integer default 0,
  created_at timestamp with time zone default now()
);

-- Create indexes for faster queries
create index if not exists idx_tasks_user_id on tasks(user_id);
create index if not exists idx_notes_user_id on notes(user_id);
create index if not exists idx_resources_user_id on resources(user_id);
create index if not exists idx_goals_user_id on goals(user_id);
create index if not exists idx_habits_user_id on habits(user_id);
create index if not exists idx_study_sessions_user_id on study_sessions(user_id);
create index if not exists idx_timetable_user_id on timetable(user_id);
create index if not exists idx_daily_reviews_user_id on daily_reviews(user_id);
create index if not exists idx_media_user_id on media(user_id);
create index if not exists idx_ai_usage_user_id on ai_usage(user_id);

-- Enable RLS
alter table tasks enable row level security;
alter table notes enable row level security;
alter table resources enable row level security;
alter table goals enable row level security;
alter table habits enable row level security;
alter table study_sessions enable row level security;
alter table timetable enable row level security;
alter table daily_reviews enable row level security;
alter table media enable row level security;
alter table ai_usage enable row level security;

-- Create RLS policies (select own data only)
create policy "Users can select their own tasks" on tasks
  for select using (auth.uid() = user_id);
create policy "Users can insert their own tasks" on tasks
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own tasks" on tasks
  for update using (auth.uid() = user_id);
create policy "Users can delete their own tasks" on tasks
  for delete using (auth.uid() = user_id);

create policy "Users can select their own notes" on notes
  for select using (auth.uid() = user_id);
create policy "Users can insert their own notes" on notes
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own notes" on notes
  for update using (auth.uid() = user_id);
create policy "Users can delete their own notes" on notes
  for delete using (auth.uid() = user_id);

create policy "Users can select their own resources" on resources
  for select using (auth.uid() = user_id);
create policy "Users can insert their own resources" on resources
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own resources" on resources
  for update using (auth.uid() = user_id);
create policy "Users can delete their own resources" on resources
  for delete using (auth.uid() = user_id);

create policy "Users can select their own goals" on goals
  for select using (auth.uid() = user_id);
create policy "Users can insert their own goals" on goals
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own goals" on goals
  for update using (auth.uid() = user_id);
create policy "Users can delete their own goals" on goals
  for delete using (auth.uid() = user_id);

create policy "Users can select their own habits" on habits
  for select using (auth.uid() = user_id);
create policy "Users can insert their own habits" on habits
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own habits" on habits
  for update using (auth.uid() = user_id);
create policy "Users can delete their own habits" on habits
  for delete using (auth.uid() = user_id);

create policy "Users can select their own study_sessions" on study_sessions
  for select using (auth.uid() = user_id);
create policy "Users can insert their own study_sessions" on study_sessions
  for insert with check (auth.uid() = user_id);
create policy "Users can delete their own study_sessions" on study_sessions
  for delete using (auth.uid() = user_id);

create policy "Users can select their own timetable" on timetable
  for select using (auth.uid() = user_id);
create policy "Users can insert their own timetable" on timetable
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own timetable" on timetable
  for update using (auth.uid() = user_id);
create policy "Users can delete their own timetable" on timetable
  for delete using (auth.uid() = user_id);

create policy "Users can select their own daily_reviews" on daily_reviews
  for select using (auth.uid() = user_id);
create policy "Users can insert their own daily_reviews" on daily_reviews
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own daily_reviews" on daily_reviews
  for update using (auth.uid() = user_id);
create policy "Users can delete their own daily_reviews" on daily_reviews
  for delete using (auth.uid() = user_id);

create policy "Users can select their own media" on media
  for select using (auth.uid() = user_id);
create policy "Users can insert their own media" on media
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own media" on media
  for update using (auth.uid() = user_id);
create policy "Users can delete their own media" on media
  for delete using (auth.uid() = user_id);

create policy "Users can select their own ai_usage" on ai_usage
  for select using (auth.uid() = user_id);
create policy "Users can insert their own ai_usage" on ai_usage
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own ai_usage" on ai_usage
  for update using (auth.uid() = user_id);
