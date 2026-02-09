create extension if not exists "pgcrypto";

create table if not exists public.gmail_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  provider text not null default 'google',
  access_token text not null,
  refresh_token text not null,
  expiry_ts timestamptz not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, email)
);

create table if not exists public.inbox_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'gmail',
  external_id text not null,
  thread_id text,
  folder text not null default 'INBOX',
  from_name text,
  from_email text,
  subject text,
  snippet text,
  internal_date bigint,
  received_at timestamptz,
  is_unread boolean default false,
  status text default 'NONE',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists inbox_messages_user_provider_external_id_key
  on public.inbox_messages (user_id, provider, external_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at_gmail_accounts on public.gmail_accounts;
create trigger set_updated_at_gmail_accounts
  before update on public.gmail_accounts
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_inbox_messages on public.inbox_messages;
create trigger set_updated_at_inbox_messages
  before update on public.inbox_messages
  for each row execute function public.set_updated_at();

alter table public.gmail_accounts enable row level security;
create policy "Users can view their gmail accounts" on public.gmail_accounts
  for select using (auth.uid() = user_id);
create policy "Users can insert their gmail accounts" on public.gmail_accounts
  for insert with check (auth.uid() = user_id);
create policy "Users can update their gmail accounts" on public.gmail_accounts
  for update using (auth.uid() = user_id);
create policy "Users can delete their gmail accounts" on public.gmail_accounts
  for delete using (auth.uid() = user_id);

alter table public.inbox_messages enable row level security;
create policy "Users can view their inbox messages" on public.inbox_messages
  for select using (auth.uid() = user_id);
create policy "Users can insert their inbox messages" on public.inbox_messages
  for insert with check (auth.uid() = user_id);
create policy "Users can update their inbox messages" on public.inbox_messages
  for update using (auth.uid() = user_id);
create policy "Users can delete their inbox messages" on public.inbox_messages
  for delete using (auth.uid() = user_id);
