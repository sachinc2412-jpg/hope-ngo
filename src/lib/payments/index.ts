import "server-only";
import type { PaymentProvider } from "./provider";
import { MockPaymentProvider } from "./mock";

/**
 * THE SWAP POINT. Returns the active payment provider. Today: mock. When Ziina
 * is integrated (last step), add the ZiinaProvider and switch on an env flag —
 * nothing else in the app changes, because everything depends on the interface.
 */
export function getPaymentProvider(): PaymentProvider {
  // const provider = process.env.PAYMENT_PROVIDER ?? "mock";
  // if (provider === "ziina") return new ZiinaProvider();  // added last
  return new MockPaymentProvider();
}

export * from "./provider";
