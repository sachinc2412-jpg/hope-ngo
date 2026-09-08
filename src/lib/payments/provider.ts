/**
 * Payment-provider SEAM. Everything downstream (donation flow, webhook,
 * dashboards) depends only on this interface — never on a specific gateway.
 * Modeled on Ziina's real shape: create a payment intent -> redirect the donor
 * to a hosted page -> receive a signed webhook -> confirm. Amounts in fils.
 *
 * The real Ziina adapter is written LAST and implements this exact interface;
 * until then a mock implementation (mock.ts) drives the whole flow so it can be
 * built and tested end-to-end without a Ziina account.
 */

export type PaymentStatus = "pending" | "completed" | "failed" | "canceled";

export interface CreateIntentParams {
  amountFils: number;
  currency: string;
  /** Our internal donation reference — echoed back on the webhook. */
  reference: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResult {
  /** Provider's payment-intent id (stored as provider_payment_intent_id). */
  id: string;
  /** Hosted page to send the donor to. */
  redirectUrl: string;
  status: PaymentStatus;
}

export interface WebhookEvent {
  type: string;
  paymentIntentId: string;
  status: PaymentStatus;
  amountFils?: number;
  reference?: string;
  /** Provider event id — used for idempotency (unique). */
  eventId: string;
  raw: unknown;
}

export interface PaymentProvider {
  readonly name: string;
  /** HTTP header carrying the webhook HMAC signature. */
  readonly signatureHeader: string;
  createPaymentIntent(params: CreateIntentParams): Promise<PaymentIntentResult>;
  getPaymentIntent(id: string): Promise<{ id: string; status: PaymentStatus }>;
  /**
   * Verify the webhook signature and parse the event. Throws if the signature
   * is invalid. NEVER trust a webhook body before this returns.
   */
  verifyAndParseWebhook(
    rawBody: string,
    signature: string | null,
    secret: string
  ): WebhookEvent;
}
