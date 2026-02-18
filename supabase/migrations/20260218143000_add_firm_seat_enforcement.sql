-- Seat enforcement for firms/organisations and invite workflow.
alter table if exists public.organisations
  add column if not exists seat_limit integer not null default 1,
  add column if not exists seat_used integer not null default 1;

-- Backward-compatible for environments that use `firms` naming.
alter table if exists public.firms
  add column if not exists seat_limit integer not null default 1,
  add column if not exists seat_used integer not null default 1;

create table if not exists public.firm_invites (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.organisations(id) on delete cascade,
  email text not null,
  role text not null check (role in ('owner', 'admin', 'staff')),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  invited_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);

create index if not exists firm_invites_firm_id_status_idx on public.firm_invites (firm_id, status);
create unique index if not exists firm_invites_pending_unique_email_idx
  on public.firm_invites (firm_id, lower(email))
  where status = 'pending';

alter table if exists public.profiles
  add column if not exists role text not null default 'staff' check (role in ('owner', 'admin', 'staff')),
  add column if not exists is_active boolean not null default true,
  add column if not exists deleted_at timestamptz;

-- Recalculate current seat usage from active user profiles.
update public.organisations o
set seat_used = coalesce(member_counts.active_members, 0)
from (
  select p.org_id, count(*)::integer as active_members
  from public.profiles p
  where p.is_active = true
  group by p.org_id
) member_counts
where member_counts.org_id = o.id;
