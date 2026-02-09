create table if not exists public.gmail_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  email text not null,
  access_token text not null,
  refresh_token text not null,
  expiry_ts timestamptz not null,
  provider text default 'gmail',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.gmail_accounts enable row level security;

create policy "Users can read their gmail accounts"
  on public.gmail_accounts
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their gmail accounts"
  on public.gmail_accounts
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their gmail accounts"
  on public.gmail_accounts
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their gmail accounts"
  on public.gmail_accounts
  for delete
  using (auth.uid() = user_id);
