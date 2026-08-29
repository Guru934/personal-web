-- Optional one-time migration after core-entities.sql.
-- If workspace_state was never created, this safely does nothing.

do $$
begin
  if to_regclass('public.workspace_state') is null then
    raise notice 'workspace_state does not exist; normalized tables are ready and no JSON migration is needed.';
    return;
  end if;

  execute $sql$
    insert into public.tasks (user_id, title, done, priority, topic)
    select ws.user_id,
           item->>'title',
           coalesce((item->>'done')::boolean, false),
           case when item->>'priority' in ('High','Medium','Low') then item->>'priority' else 'Medium' end,
           nullif(item->>'topic', '')
    from public.workspace_state ws
    cross join lateral jsonb_array_elements(coalesce(ws.data->'tasks', '[]'::jsonb)) item
    where nullif(item->>'title', '') is not null
      and not exists (select 1 from public.tasks t where t.user_id = ws.user_id and t.title = item->>'title')
  $sql$;

  execute $sql$
    insert into public.notes (user_id, title, body, topic)
    select ws.user_id,
           item->>'title',
           coalesce(item->>'body', ''),
           coalesce(nullif(item->>'topic', ''), 'General')
    from public.workspace_state ws
    cross join lateral jsonb_array_elements(coalesce(ws.data->'notes', '[]'::jsonb)) item
    where nullif(item->>'title', '') is not null
      and not exists (select 1 from public.notes n where n.user_id = ws.user_id and n.title = item->>'title')
  $sql$;
end
$$;
