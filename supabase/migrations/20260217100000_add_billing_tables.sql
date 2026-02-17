-- Core billing tables for trial and Stripe subscription lifecycle.
create table if not exists public.organisations (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  stripe_customer_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  stripe_subscription_id text unique,
  stripe_price_id text,
  status text not null check (status in ('trial', 'active', 'past_due', 'cancelled')),
  trial_started_at timestamptz,
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organisation_id)
);

create index if not exists subscriptions_status_idx on public.subscriptions(status);

alter table public.organisations enable row level security;
alter table public.subscriptions enable row level security;

create policy "users can read own organisation"
on public.organisations
for select using (auth.uid() = owner_user_id);

create policy "users can read own subscription"
on public.subscriptions
for select using (
  exists (
    select 1
    from public.organisations o
    where o.id = subscriptions.organisation_id
      and o.owner_user_id = auth.uid()
  )
);
