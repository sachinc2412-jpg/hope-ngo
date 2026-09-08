-- ============================================================================
-- 0007 (Day 17) — extend process_payment_event to handle refunds.
-- Adds 'refunded' as a valid status and ALWAYS refreshes project_stats after a
-- status change (when the donation has a project). Because the total is derived
-- from the ledger (sum of status='succeeded'), a refund automatically LOWERS the
-- funding — no manual decrement, no drift.
-- ============================================================================

create or replace function public.process_payment_event(
  p_event_id          text,
  p_payment_intent_id text,
  p_status            text,     -- 'succeeded' | 'failed' | 'refunded'
  p_amount_fils       bigint,
  p_raw               jsonb
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rows      integer;
  v_donation  donations%rowtype;
begin
  if p_status not in ('succeeded', 'failed', 'refunded') then
    return 'ignored';
  end if;

  -- (1) idempotency gate
  insert into payment_transactions (provider_event_id, type, amount_cents, raw_event)
  values (p_event_id, p_status, p_amount_fils, p_raw)
  on conflict (provider_event_id) do nothing;
  get diagnostics v_rows = row_count;
  if v_rows = 0 then
    return 'duplicate';
  end if;

  -- (2) find + lock the donation
  select * into v_donation
    from donations
   where provider_payment_intent_id = p_payment_intent_id
   for update;
  if not found then
    return 'donation_not_found';
  end if;

  update payment_transactions
     set donation_id = v_donation.id
   where provider_event_id = p_event_id;

  update donations set status = p_status where id = v_donation.id;

  -- (3) ALWAYS re-derive project_stats from the ledger after a status change.
  if v_donation.project_id is not null then
    insert into project_stats (project_id, raised_cents, donation_count, updated_at)
    select v_donation.project_id,
           coalesce(sum(amount_cents) filter (where status = 'succeeded'), 0),
           count(*) filter (where status = 'succeeded'),
           now()
      from donations
     where project_id = v_donation.project_id
    on conflict (project_id) do update
      set raised_cents   = excluded.raised_cents,
          donation_count = excluded.donation_count,
          updated_at     = excluded.updated_at;
  end if;

  return 'processed';
end;
$$;
