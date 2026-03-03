create table if not exists public.gmail_labels (
  id uuid primary key default gen_random_uuid(),
  connected_account_id uuid not null,
  gmail_label_id text not null,
  label_name text not null,
  label_type text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (connected_account_id, gmail_label_id)
);

create index if not exists gmail_labels_connected_account_id_label_name_idx
  on public.gmail_labels (connected_account_id, label_name);

drop trigger if exists set_updated_at_gmail_labels on public.gmail_labels;
create trigger set_updated_at_gmail_labels
  before update on public.gmail_labels
  for each row execute function public.set_updated_at();
