-- ============================================================================
-- 0009 admin_donations view (Day 23) — flat donation+donor+project for search.
-- security_invoker = true is CRITICAL: the view runs with the CALLER's RLS, so
-- admins see all rows, a normal user sees only their own. A default (definer)
-- view would bypass RLS and leak every donation — we do NOT do that.
-- ============================================================================

create or replace view admin_donations
with (security_invoker = true) as
select
  d.id,
  d.created_at,
  d.amount_cents,
  d.currency,
  d.designation,
  d.status,
  d.reference,
  d.is_anonymous,
  dn.email        as donor_email,
  dn.display_name as donor_name,
  p.slug          as project_slug
from donations d
left join donors   dn on dn.id = d.donor_id
left join projects p  on p.id = d.project_id;

grant select on admin_donations to authenticated;
