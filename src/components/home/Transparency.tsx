import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/sanity/image";
import type { TransparencyData, PartnerData } from "@/sanity/types";

const FALLBACK_STATEMENT =
  "We believe trust is earned through openness. Our financials, annual reports and audited statements are published in full — so you can see exactly where your gift goes.";

/**
 * Transparency section (homepage teaser). Statement + partner logos + link to
 * the full /transparency page (built Day 28). Statement falls back; partners
 * omit if none.
 */
export function Transparency({
  data,
  partners,
}: {
  data: TransparencyData | null;
  partners: PartnerData[];
}) {
  const statement = data?.statement || FALLBACK_STATEMENT;

  return (
    <section className="border-line bg-bg-raised border-t">
      <div className="mx-auto max-w-[var(--container-content)] px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <p className="text-ink-faint font-sans text-sm tracking-wide uppercase">
            Transparency
          </p>
          <h2 className="font-display text-ink mt-3 text-4xl leading-tight tracking-tight md:text-5xl">
            You deserve to know where your money goes.
          </h2>
          <p className="text-ink-soft mt-6 font-sans text-lg leading-relaxed">
            {statement}
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/transparency">See our financials</Link>
          </Button>
        </div>

        {partners.length > 0 && (
          <div className="border-line mt-16 border-t pt-10">
            <p className="text-ink-faint font-sans text-xs tracking-wide uppercase">
              Our partners
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-6">
              {partners.map((p) =>
                p.logo ? (
                  <div key={p._id} className="relative h-8 w-28">
                    <Image
                      src={urlFor(p.logo).height(64).fit("max").url()}
                      alt={p.logo.alt ?? p.name}
                      fill
                      sizes="112px"
                      className="object-contain opacity-70"
                    />
                  </div>
                ) : (
                  <span key={p._id} className="text-ink-soft font-sans text-sm">
                    {p.name}
                  </span>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
