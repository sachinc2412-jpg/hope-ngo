"use server";

import { randomUUID, createHmac } from "crypto";

/**
 * MOCK ONLY — simulates the donor completing payment on Ziina's hosted page by
 * building a signed event and POSTing it to our real webhook, exercising the
 * exact signature-verify + idempotency path. Deleted when the real Ziina adapter
 * lands (Ziina itself will POST the webhook).
 */
export async function completeMockPayment(
  paymentIntentId: string,
  reference: string,
  amountFils: number,
  outcome: "completed" | "failed" = "completed"
): Promise<{ ok: boolean }> {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  if (!secret) return { ok: false };

  const body = JSON.stringify({
    eventId: randomUUID(),
    type: `payment-intent.${outcome}`,
    data: {
      paymentIntentId,
      status: outcome,
      amountFils,
      reference,
    },
  });
  const signature = createHmac("sha256", secret).update(body).digest("hex");

  const res = await fetch(`${site}/api/payments/webhook`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-mock-signature": signature },
    body,
  });
  return { ok: res.ok };
}
