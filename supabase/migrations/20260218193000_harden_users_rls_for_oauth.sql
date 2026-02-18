-- Ensure first-login OAuth can read the app-level user row while keeping RLS enabled.
do $$
begin
  if to_regclass('public.users') is not null then
    execute 'alter table public.users enable row level security';

    execute 'drop policy if exists "users can select own app user" on public.users';
    execute 'create policy "users can select own app user" on public.users for select using (id = auth.uid())';

    execute 'drop policy if exists "users can insert own app user" on public.users';
    execute 'create policy "users can insert own app user" on public.users for insert with check (id = auth.uid())';

    execute 'drop policy if exists "service role can insert app users" on public.users';
    execute 'create policy "service role can insert app users" on public.users for insert to service_role with check (true)';
  end if;

  if to_regclass('public.firms') is not null then
    execute 'alter table public.firms enable row level security';

    execute 'drop policy if exists "authenticated can select their firm" on public.firms';
    execute $policy$
      create policy "authenticated can select their firm"
      on public.firms
      for select
      using (
        exists (
          select 1
          from public.users u
          where u.id = auth.uid()
            and u.firm_id = firms.id
        )
      )
    $policy$;

    execute 'drop policy if exists "service role can insert firms" on public.firms';
    execute 'create policy "service role can insert firms" on public.firms for insert to service_role with check (true)';
  end if;
end $$;
