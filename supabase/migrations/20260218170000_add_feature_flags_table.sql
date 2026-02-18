create table if not exists public.feature_flags (
  id text primary key,
  flags jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

insert into public.feature_flags (id, flags)
values ('global', '{}'::jsonb)
on conflict (id) do nothing;
