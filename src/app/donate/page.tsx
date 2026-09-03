import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Donate — Hope",
  description: "Make a gift that goes to work immediately.",
};

/**
 * PUBLIC donate page — reachable with NO account (the guest path). This is a
 * stub; the real multi-step donation flow (amount → designation → donor →
 * Stripe payment) is built Day 12+. Kept public and un-gated on purpose.
 */
export default function DonatePage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-ink text-4xl tracking-tight md:text-5xl">
        Make your gift
      </h1>
      <p className="text-ink-soft mx-auto mt-4 max-w-md font-sans text-lg">
        The full donation experience is being built. No account needed — you can always
        give as a guest.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link href="/">Back home</Link>
      </Button>
    </section>
  );
}
