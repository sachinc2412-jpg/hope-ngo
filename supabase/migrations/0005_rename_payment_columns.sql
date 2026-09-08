-- ============================================================================
-- 0005 rename provider-specific columns (Day 14)
-- We're using Ziina, not Stripe, and the code depends on a provider-agnostic
-- seam. Rename the stripe_* columns so the schema doesn't lie about the gateway.
-- ============================================================================

alter table donations
  rename column stripe_payment_intent_id to provider_payment_intent_id;

alter table payment_transactions
  rename column stripe_event_id to provider_event_id;

alter table subscriptions
  rename column stripe_subscription_id to provider_subscription_id;
