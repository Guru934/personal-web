-- LEGACY COMPATIBILITY BRIDGE.
-- New installations should run core-entities.sql instead; normalized tables
-- are the long-term source of truth. Keep this table only while migrating
-- existing JSON-backed Tasks/Notes without data loss.
create table if not exists public.workspace_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.workspace_state enable row level security;
create policy "Users manage their workspace state" on public.workspace_state
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
