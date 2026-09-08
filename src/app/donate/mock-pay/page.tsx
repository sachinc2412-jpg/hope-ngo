import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatAed } from "@/lib/validation/donation";
import { MockPayButton } from "./MockPayButton";

/**
 * MOCK hosted payment page — stands in for Ziina's hosted page while integration
 * is deferred. "Pay now" fires a real signed webhook against our own endpoint,
 * exercising the true verify + idempotency + confirm path. Replaced by Ziina's
 * real checkout when the adapter lands.
 */
export default async function MockPayPage({
  searchParams,
}: {
  searchParams: Promise<{ pi?: string; ref?: string; amount?: string }>;
}) {
  const sp = await searchParams;
  const amount = sp.amount ? parseInt(sp.amount, 10) : 0;

  return (
    <section className="mx-auto max-w-md px-6 py-24">
      <div className="border-line bg-bg-raised rounded-lg border p-8">
        <p className="text-ink-faint font-sans text-xs tracking-wide uppercase">
          Simulated payment page (mock)
        </p>
        <h1 className="text-ink font-display mt-3 text-3xl">{formatAed(amount)}</h1>
        <p className="text-ink-soft mt-2 font-sans text-sm">Reference {sp.ref}</p>

        <div className="mt-8 flex flex-col gap-3">
          <MockPayButton pi={sp.pi ?? ""} reference={sp.ref ?? ""} amountFils={amount} />
          <Button asChild variant="secondary" className="w-full">
            <Link href="/donate?canceled=1">Cancel</Link>
          </Button>
        </div>

        <p className="text-ink-faint mt-6 font-sans text-xs">
          &ldquo;Pay now&rdquo; sends a signed webhook to confirm your donation — the same
          path Ziina will use. This page is replaced by Ziina&rsquo;s real checkout when
          integrated.
        </p>
      </div>
    </section>
  );
}
