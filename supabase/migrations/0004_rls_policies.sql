-- ============================================================================
-- 0004 RLS policies (Day 11)
-- Opens the specific doors on top of the deny-all baseline from 0002.
-- Model:
--   public (anon+auth): read ACTIVE projects/campaigns, project_stats, stories,
--                       impact_updates, fundraisers, organizations. Insert
--                       volunteer applications.
--   authenticated user: read ONLY their own donor/donation/subscription rows.
--   admin (users.role='admin'): full read/write.
--   service_role (server): bypasses RLS entirely — used for money writes.
-- ============================================================================

-- Admin check as SECURITY DEFINER so it bypasses RLS on users (no recursion).
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  );
$$;

-- organizations ------------------------------------------------------------
create policy org_public_read on organizations
  for select to anon, authenticated using (true);
create policy org_admin_write on organizations
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- users --------------------------------------------------------------------
create policy users_self_read on users
  for select to authenticated using (id = auth.uid() or public.is_admin());
create policy users_self_update on users
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- donors -------------------------------------------------------------------
create policy donors_owner_read on donors
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy donors_admin_write on donors
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- projects: public reads ACTIVE only; admin reads/writes all ----------------
create policy projects_public_read on projects
  for select to anon, authenticated using (status = 'active' or public.is_admin());
create policy projects_admin_write on projects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- campaigns ----------------------------------------------------------------
create policy campaigns_public_read on campaigns
  for select to anon, authenticated using (status = 'active' or public.is_admin());
create policy campaigns_admin_write on campaigns
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- donations: owner reads ONLY their own; admin reads all --------------------
-- (inserts happen via service_role after server-side validation — no client
--  insert policy on purpose.)
create policy donations_owner_read on donations
  for select to authenticated using (
    public.is_admin()
    or donor_id in (select id from donors where user_id = auth.uid())
  );
create policy donations_admin_write on donations
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- subscriptions: owner reads own; admin all --------------------------------
create policy subs_owner_read on subscriptions
  for select to authenticated using (
    public.is_admin()
    or donor_id in (select id from donors where user_id = auth.uid())
  );
create policy subs_admin_write on subscriptions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- payment_transactions: admin read only (writes = service_role) -------------
create policy pt_admin_read on payment_transactions
  for select to authenticated using (public.is_admin());

-- project_stats: public read (funding totals shown on site) -----------------
create policy stats_public_read on project_stats
  for select to anon, authenticated using (true);
create policy stats_admin_write on project_stats
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- impact_updates / stories / fundraisers: public read, admin write ----------
create policy iu_public_read on impact_updates
  for select to anon, authenticated using (true);
create policy iu_admin_write on impact_updates
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy stories_public_read on stories
  for select to anon, authenticated using (true);
create policy stories_admin_write on stories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy fr_public_read on fundraisers
  for select to anon, authenticated using (true);
create policy fr_admin_write on fundraisers
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- volunteers: anyone may APPLY (insert); only admin may read ----------------
create policy vol_public_insert on volunteers
  for insert to anon, authenticated with check (true);
create policy vol_admin_read on volunteers
  for select to authenticated using (public.is_admin());

-- audit_log: admin read only (inserts via service_role) ---------------------
create policy audit_admin_read on audit_log
  for select to authenticated using (public.is_admin());
