-- ============================================================================
-- 0001 initial schema — NGO fundraising platform (Day 9)
-- Architecture doc §7. Tables, keys, indexes, constraints only.
-- Auth trigger = Day 10 (0002). RLS policies = Day 11 (0003).
--
-- DESIGN RULES ENFORCED HERE:
--  * NO projects.amount_raised column. The raised total is DERIVED from the
--    donations ledger and cached in project_stats, refreshed by the Stripe
--    webhook. A mutable running total invites race conditions + drift.
--  * Enums are text + CHECK (not native enum types) so values are easy to
--    extend later without fragile ALTER TYPE migrations.
--  * All money is *_cents BIGINT. Never floats for currency.
--  * Idempotency: stripe_event_id / stripe_payment_intent_id are UNIQUE so a
--    replayed webhook inserts once.
-- ============================================================================

create extension if not exists pgcrypto; -- gen_random_uuid()

-- ---------------------------------------------------------------------------
-- organizations (single row for now; schema is multi-tenant-ready)
-- ---------------------------------------------------------------------------
create table organizations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- users — mirrors auth.users (Supabase-managed). id IS the auth user id.
-- ---------------------------------------------------------------------------
create table users (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text unique,
  role        text not null default 'donor' check (role in ('donor', 'admin')),
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- donors — a giver. user_id null = guest / anonymous gift (no account).
-- ---------------------------------------------------------------------------
create table donors (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references users (id) on delete set null,
  email         text,
  display_name  text,
  country       text,
  is_anonymous  boolean not null default false,
  created_at    timestamptz not null default now()
);
create index donors_email_idx on donors (email);
create index donors_user_id_idx on donors (user_id);

-- ---------------------------------------------------------------------------
-- projects — FINANCIAL row. Editorial content lives in Sanity, joined by slug.
-- No amount_raised here (derived; see project_stats).
-- ---------------------------------------------------------------------------
create table projects (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references organizations (id) on delete cascade,
  slug        text not null unique,
  status      text not null default 'draft'
                check (status in ('draft', 'active', 'funded', 'closed')),
  goal_cents  bigint check (goal_cents is null or goal_cents > 0),
  currency    char(3) not null default 'USD',
  lat         numeric,
  lng         numeric,
  created_at  timestamptz not null default now()
);
create index projects_status_idx on projects (status);

-- ---------------------------------------------------------------------------
-- campaigns — time-boxed fundraising drives.
-- ---------------------------------------------------------------------------
create table campaigns (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references organizations (id) on delete cascade,
  slug        text not null unique,
  goal_cents  bigint check (goal_cents is null or goal_cents > 0),
  currency    char(3) not null default 'USD',
  starts_at   timestamptz,
  ends_at     timestamptz,
  status      text not null default 'draft'
                check (status in ('draft', 'active', 'closed')),
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- donations — the money ledger. Authoritative source of "raised".
-- ---------------------------------------------------------------------------
create table donations (
  id                        uuid primary key default gen_random_uuid(),
  donor_id                  uuid references donors (id) on delete set null,
  project_id                uuid references projects (id) on delete set null,
  campaign_id               uuid references campaigns (id) on delete set null,
  amount_cents              bigint not null check (amount_cents > 0),
  currency                  char(3) not null default 'USD',
  designation               text not null default 'most_needed'
                              check (designation in ('most_needed', 'education',
                              'healthcare', 'food', 'water', 'project')),
  type                      text not null default 'one_time'
                              check (type in ('one_time', 'recurring')),
  status                    text not null default 'pending'
                              check (status in ('pending', 'succeeded',
                              'refunded', 'failed')),
  stripe_payment_intent_id  text unique,
  reference                 text unique,
  is_anonymous              boolean not null default false,
  created_at                timestamptz not null default now()
);
create index donations_donor_id_idx on donations (donor_id);
create index donations_project_id_idx on donations (project_id);
create index donations_status_idx on donations (status);
create index donations_created_at_idx on donations (created_at);

-- ---------------------------------------------------------------------------
-- subscriptions — recurring gifts. status MIRRORS Stripe (source of truth).
-- ---------------------------------------------------------------------------
create table subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  donor_id                uuid not null references donors (id) on delete cascade,
  stripe_subscription_id  text not null unique,
  amount_cents            bigint not null check (amount_cents > 0),
  currency                char(3) not null default 'USD',
  interval                text not null default 'month' check (interval in ('month')),
  designation             text not null default 'most_needed',
  status                  text not null, -- mirrors Stripe verbatim
  current_period_end      timestamptz,
  created_at              timestamptz not null default now()
);
create index subscriptions_donor_id_idx on subscriptions (donor_id);
create index subscriptions_status_idx on subscriptions (status);

-- ---------------------------------------------------------------------------
-- payment_transactions — webhook ledger. stripe_event_id UNIQUE = idempotency.
-- ---------------------------------------------------------------------------
create table payment_transactions (
  id              uuid primary key default gen_random_uuid(),
  donation_id     uuid references donations (id) on delete set null,
  stripe_event_id text not null unique,
  type            text,
  amount_cents    bigint,
  raw_event       jsonb,
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- project_stats — DERIVED cache of the funding total. Rebuildable from the
-- donations ledger; refreshed by the Stripe webhook. The ledger stays
-- authoritative; this is disposable read-optimization.
-- ---------------------------------------------------------------------------
create table project_stats (
  project_id      uuid primary key references projects (id) on delete cascade,
  raised_cents    bigint not null default 0,
  donation_count  integer not null default 0,
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- impact_updates / stories — link Sanity content to Postgres associations.
-- ---------------------------------------------------------------------------
create table impact_updates (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid references projects (id) on delete cascade,
  sanity_doc_id text,
  published_at  timestamptz
);

create table stories (
  id            uuid primary key default gen_random_uuid(),
  sanity_doc_id text,
  project_id    uuid references projects (id) on delete set null,
  published_at  timestamptz
);

-- ---------------------------------------------------------------------------
-- fundraisers / volunteers — get-involved.
-- ---------------------------------------------------------------------------
create table fundraisers (
  id          uuid primary key default gen_random_uuid(),
  donor_id    uuid references donors (id) on delete set null,
  title       text not null,
  goal_cents  bigint check (goal_cents is null or goal_cents > 0),
  slug        text not null unique,
  status      text not null default 'active'
                check (status in ('active', 'closed')),
  created_at  timestamptz not null default now()
);

create table volunteers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  interest    text,
  message     text,
  status      text not null default 'new'
                check (status in ('new', 'contacted', 'archived')),
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- audit_log — every admin mutation (populated Day 26). Insert-only in practice.
-- ---------------------------------------------------------------------------
create table audit_log (
  id            uuid primary key default gen_random_uuid(),
  actor_user_id uuid references users (id) on delete set null,
  action        text not null,
  entity        text,
  entity_id     uuid,
  metadata      jsonb,
  created_at    timestamptz not null default now()
);
create index audit_log_actor_idx on audit_log (actor_user_id);
create index audit_log_created_at_idx on audit_log (created_at);
