import Link from "next/link";
import type { DonationTierData } from "@/sanity/types";

/**
 * "Your donation" section. Shows configurable tiers ($ → impact) from Sanity.
 * Each tier links to the donation flow with the amount pre-selected. Full
 * interactive amount selection lives in the donation flow (Day 12); this is the
 * homepage teaser. Renders nothing if no tiers are configured.
 */
export function DonationImpact({ tiers }: { tiers: DonationTierData[] }) {
  if (tiers.length === 0) return null;

  return (
    <section className="mx-auto max-w-[var(--container-content)] px-6 py-24 md:py-32">
      <div className="max-w-2xl">
        <p className="text-ink-faint font-sans text-sm tracking-wide uppercase">
          Your donation
        </p>
        <h2 className="font-display text-ink mt-3 text-4xl leading-tight tracking-tight md:text-5xl">
          See exactly what your gift makes possible.
        </h2>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier) => (
          <Link
            key={tier._id}
            href={`/donate?amount=${tier.amountCents}`}
            className="group border-line bg-bg-raised hover:border-accent flex flex-col rounded-lg border p-6 transition-colors"
          >
            <span className="font-display text-ink text-3xl">{tier.label}</span>
            {tier.impactCopy && (
              <span className="text-ink-soft mt-3 font-sans text-sm leading-relaxed">
                {tier.impactCopy}
              </span>
            )}
            <span className="text-accent mt-6 font-sans text-sm font-medium">
              Give {tier.label} &rarr;
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
