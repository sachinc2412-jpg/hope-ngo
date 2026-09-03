-- ============================================================================
-- 0002 enable RLS on every table (Day 9 addendum)
-- Enabling RLS with NO policies = deny-all to the anon/authenticated roles =
-- the table is locked shut to the public API. This is the SAFE state.
-- The service_role key (server-side) has BYPASSRLS, so app server code is
-- unaffected. Actual read/write POLICIES are added Day 11 (0003) to open the
-- specific doors (a donor reads their own donations; public reads active
-- projects; etc). Until then: nothing but service_role can touch these tables.
-- ============================================================================

alter table organizations        enable row level security;
alter table users                enable row level security;
alter table donors               enable row level security;
alter table projects             enable row level security;
alter table campaigns            enable row level security;
alter table donations            enable row level security;
alter table subscriptions        enable row level security;
alter table payment_transactions enable row level security;
alter table project_stats        enable row level security;
alter table impact_updates       enable row level security;
alter table stories              enable row level security;
alter table fundraisers          enable row level security;
alter table volunteers           enable row level security;
alter table audit_log            enable row level security;
