-- ============================================================================
-- seed.sql — minimal test data (Day 9). One org + sample projects + stats rows.
-- IMPORTANT: a project's `slug` here MUST match the slug of the matching Sanity
-- project doc — that's the join key. Change these to your real Sanity slugs, or
-- add rows for them, so funding data lines up on Day 27.
-- ============================================================================

insert into organizations (id, name, slug)
values ('00000000-0000-0000-0000-000000000001', 'Hope', 'hope')
on conflict (slug) do nothing;

-- Sample projects. Replace slugs with your real Sanity project slugs.
insert into projects (org_id, slug, status, goal_cents, currency, lat, lng)
values
  ('00000000-0000-0000-0000-000000000001', 'clean-water-kakuma', 'active', 5000000, 'USD', 3.7167, 34.8667),
  ('00000000-0000-0000-0000-000000000001', 'girls-education-sindh', 'active', 3000000, 'USD', 25.8943, 68.5247)
on conflict (slug) do nothing;

-- One project_stats row per project, starting at zero (raised is derived).
insert into project_stats (project_id, raised_cents, donation_count)
select id, 0, 0 from projects
on conflict (project_id) do nothing;
