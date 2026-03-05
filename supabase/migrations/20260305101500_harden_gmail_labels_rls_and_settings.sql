alter table public.gmail_labels
  add column if not exists is_enabled boolean not null default true,
  add column if not exists is_archived boolean not null default false,
  add column if not exists color_background text,
  add column if not exists color_text text,
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists set_updated_at_gmail_labels on public.gmail_labels;
create trigger set_updated_at_gmail_labels
  before update on public.gmail_labels
  for each row execute function public.set_updated_at();

alter table public.gmail_labels enable row level security;

drop policy if exists "Users can select own gmail labels by connected account" on public.gmail_labels;
create policy "Users can select own gmail labels by connected account"
  on public.gmail_labels
  for select
  using (
    exists (
      select 1
      from public.connected_accounts
      where public.connected_accounts.id = public.gmail_labels.connected_account_id
        and public.connected_accounts.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update own gmail labels by connected account" on public.gmail_labels;
create policy "Users can update own gmail labels by connected account"
  on public.gmail_labels
  for update
  using (
    exists (
      select 1
      from public.connected_accounts
      where public.connected_accounts.id = public.gmail_labels.connected_account_id
        and public.connected_accounts.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.connected_accounts
      where public.connected_accounts.id = public.gmail_labels.connected_account_id
        and public.connected_accounts.user_id = auth.uid()
    )
  );
