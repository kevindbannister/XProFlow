alter table public.organisations
  add column if not exists default_locale text not null default 'en-GB';

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid not null references public.organisations(id) on delete cascade,
  display_name text,
  professional_context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.professional_context_user (
  user_id uuid primary key references auth.users(id) on delete cascade,
  primary_role text not null,
  job_title_selected text not null,
  job_title_custom text not null default '',
  seniority_level text not null,
  work_setting text not null,
  specialisms text[] not null default '{}',
  audiences text[] not null default '{}',
  writing_style text not null default 'Professional',
  risk_posture text not null default 'Balanced (professional + pragmatic)',
  locale text not null default 'en-GB',
  context_version integer not null default 1,
  updated_at timestamptz not null default now()
);

create table if not exists public.professional_context_org (
  org_id uuid primary key references public.organisations(id) on delete cascade,
  firm_name text,
  signature_block text,
  disclaimer_text text,
  updated_at timestamptz not null default now()
);

create table if not exists public.professional_taxonomy (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('role','title','specialism','audience')),
  category text not null,
  value text not null,
  synonyms text[] not null default '{}',
  sort_order integer not null default 0,
  unique (kind, category, value)
);

insert into public.professional_taxonomy (kind, category, value, synonyms, sort_order)
values
('role', 'primary', 'Accountant (Practice)', array['Public practice accountant'], 1),
('role', 'primary', 'Finance Director / CFO', array['FD','CFO'], 2),
('role', 'primary', 'Financial Controller', array['FC'], 3),
('role', 'primary', 'Finance Manager', array[]::text[], 4),
('title', 'practice', 'Partner', array['Equity Partner'], 1),
('title', 'practice', 'Senior Manager', array[]::text[], 2),
('title', 'in_house', 'Chief Financial Officer', array['CFO'], 3),
('title', 'in_house', 'Finance Director', array['FD'], 4),
('title', 'in_house', 'Financial Controller', array['FC'], 5),
('specialism', 'default', 'VAT', array['Value Added Tax'], 1),
('specialism', 'default', 'Payroll', array[]::text[], 2),
('specialism', 'default', 'Audit', array[]::text[], 3),
('audience', 'default', 'Business owners / directors', array['Founders'], 1),
('audience', 'default', 'HMRC / regulators', array['HMRC'], 2)
on conflict do nothing;

alter table public.profiles enable row level security;
alter table public.professional_context_user enable row level security;
alter table public.professional_context_org enable row level security;
alter table public.professional_taxonomy enable row level security;

create policy "users can manage own profile"
on public.profiles
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users can manage own professional context"
on public.professional_context_user
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "org owners can read org context"
on public.professional_context_org
for select
using (
  exists (
    select 1 from public.organisations o
    where o.id = professional_context_org.org_id
      and o.owner_user_id = auth.uid()
  )
);

create policy "org owners can write org context"
on public.professional_context_org
for all
using (
  exists (
    select 1 from public.organisations o
    where o.id = professional_context_org.org_id
      and o.owner_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.organisations o
    where o.id = professional_context_org.org_id
      and o.owner_user_id = auth.uid()
  )
);

create policy "taxonomy readable by authenticated"
on public.professional_taxonomy
for select
using (auth.role() = 'authenticated');
