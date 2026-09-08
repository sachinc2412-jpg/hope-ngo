-- ============================================================================
-- 0008 admin_overview (Day 22) — aggregate stats for the admin dashboard.
-- SECURITY DEFINER + an internal is_admin() check: even if a non-admin session
-- calls it, it refuses. Returns one JSON blob so the dashboard needs one round-trip.
-- (No recurring metric — Ziina is one-time.)
-- ============================================================================

create or replace function public.admin_overview()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  result json;
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  select json_build_object(
    'total_raised_cents',
      coalesce((select sum(amount_cents) from donations where status='succeeded'),0),
    'donations_count',
      (select count(*) from donations where status='succeeded'),
    'this_month_cents',
      coalesce((select sum(amount_cents) from donations
        where status='succeeded' and created_at >= date_trunc('month', now())),0),
    'donors_count',
      (select count(*) from donors),
    'active_projects',
      (select count(*) from projects where status='active')
  ) into result;

  return result;
end;
$$;
