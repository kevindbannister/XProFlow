create table if not exists public.oauth_states (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  nonce text not null,
  return_to text,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

create unique index if not exists oauth_states_provider_nonce_idx
  on public.oauth_states (provider, nonce);

create index if not exists oauth_states_expires_at_idx
  on public.oauth_states (expires_at);
