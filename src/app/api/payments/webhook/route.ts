import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPaymentProvider } from "@/lib/payments";
import { sendReceiptEmail } from "@/lib/email/receipt";

/**
 * Payment webhook. The confirming half of the flow — the ONLY thing that marks a
 * donation succeeded. Steps:
 *   1. Read the RAW body (needed for signature verification — never parse first).
 *   2. Verify the HMAC signature via the provider seam (throws -> 401).
 *   3. Map provider status -> our status, then call the atomic
 *      process_payment_event() RPC, which handles idempotency + the status flip
 *      + refreshing project_stats in one transaction.
 * Replays are safe (RPC returns 'duplicate'). Always 200 on a verified event so
 * the provider stops retrying.
 */
export async function POST(req: NextRequest) {
  const provider = getPaymentProvider();
  const raw = await req.text();
  const signature = req.headers.get(provider.signatureHeader);
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;

  if (!secret) {
    console.error("PAYMENT_WEBHOOK_SECRET is not set");
    return new NextResponse("Server misconfigured", { status: 500 });
  }

  let event;
  try {
    event = provider.verifyAndParseWebhook(raw, signature, secret);
  } catch {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  const status =
    event.status === "completed"
      ? "succeeded"
      : event.status === "failed"
        ? "failed"
        : null;
  if (!status) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.rpc("process_payment_event", {
    p_event_id: event.eventId,
    p_payment_intent_id: event.paymentIntentId,
    p_status: status,
    p_amount_fils: event.amountFils ?? null,
    p_raw: event.raw,
  });

  if (error) {
    console.error("process_payment_event failed:", error);
    return new NextResponse("Processing error", { status: 500 });
  }

  // Send the receipt ONCE — only on first processing, never on replays.
  if (data === "processed" && status === "succeeded") {
    const { data: d } = await admin
      .from("donations")
      .select("amount_cents, reference, designation, donors(email, display_name)")
      .eq("provider_payment_intent_id", event.paymentIntentId)
      .maybeSingle();
    const donor = d?.donors as
      | { email: string | null; display_name: string | null }
      | { email: string | null; display_name: string | null }[]
      | null;
    const donorRow = Array.isArray(donor) ? donor[0] : donor;
    if (d && donorRow?.email) {
      await sendReceiptEmail({
        to: donorRow.email,
        name: donorRow.display_name || "Friend",
        amountFils: d.amount_cents,
        reference: d.reference,
        designation: d.designation,
      });
    }
  }

  return NextResponse.json({ ok: true, result: data });
}
