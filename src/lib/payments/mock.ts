import "server-only";
import { createHmac, timingSafeEqual, randomUUID } from "crypto";
import type {
  PaymentProvider,
  CreateIntentParams,
  PaymentIntentResult,
  WebhookEvent,
  PaymentStatus,
} from "./provider";

/**
 * Mock payment provider. Simulates Ziina's flow locally:
 *  - createPaymentIntent -> returns an id + a redirect to our own mock hosted
 *    page (/donate/mock-pay), so the full flow is walkable without Ziina.
 *  - verifyAndParseWebhook -> REAL HMAC-SHA256 verification (identical logic the
 *    Ziina adapter will use), so the webhook/idempotency code is tested for real.
 * The signPayload helper lets a local simulator produce a valid signature.
 */
export class MockPaymentProvider implements PaymentProvider {
  readonly name = "mock";
  readonly signatureHeader = "x-mock-signature";

  async createPaymentIntent(params: CreateIntentParams): Promise<PaymentIntentResult> {
    const id = `mock_pi_${randomUUID()}`;
    const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const url = new URL("/donate/mock-pay", base);
    url.searchParams.set("pi", id);
    url.searchParams.set("ref", params.reference);
    url.searchParams.set("amount", String(params.amountFils));
    return { id, redirectUrl: url.toString(), status: "pending" };
  }

  async getPaymentIntent(id: string) {
    // Mock has no store; authoritative status lives in our DB. Report pending.
    return { id, status: "pending" as PaymentStatus };
  }

  verifyAndParseWebhook(
    rawBody: string,
    signature: string | null,
    secret: string
  ): WebhookEvent {
    if (!signature) throw new Error("Missing webhook signature");
    const expected = signPayload(rawBody, secret);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new Error("Invalid webhook signature");
    }
    const body = JSON.parse(rawBody) as {
      eventId: string;
      type: string;
      data: {
        paymentIntentId: string;
        status: PaymentStatus;
        amountFils?: number;
        reference?: string;
      };
    };
    return {
      type: body.type,
      paymentIntentId: body.data.paymentIntentId,
      status: body.data.status,
      amountFils: body.data.amountFils,
      reference: body.data.reference,
      eventId: body.eventId,
      raw: body,
    };
  }
}

/** HMAC-SHA256 hex signature of a raw body — shared by mock + test simulator. */
export function signPayload(rawBody: string, secret: string): string {
  return createHmac("sha256", secret).update(rawBody).digest("hex");
}
