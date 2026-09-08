import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroMedia } from "@/components/motion/HeroMedia";
import type { HomepageData } from "@/sanity/types";

const FALLBACK_HEADLINE = "Together, we can change what tomorrow looks like.";
const FALLBACK_SUBTEXT =
  "Every contribution helps create access to opportunity, dignity and a better future for communities that need it most.";

/**
 * Full-width hero. Renders the Sanity hero image with a legibility scrim when
 * present; otherwise text on ivory. Static — image movement/parallax is Day 32.
 */
export function Hero({ data }: { data: HomepageData | null }) {
  const headline = data?.heroHeadline || FALLBACK_HEADLINE;
  const subtext = data?.heroSubtext || FALLBACK_SUBTEXT;
  const hasImage = Boolean(data?.heroMedia);

  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden">
      {hasImage && (
        <>
          <HeroMedia image={data!.heroMedia!} />
          {/* Legibility scrim — functional, not decoration. */}
          <div className="from-ink/70 via-ink/30 to-ink/10 absolute inset-0 bg-gradient-to-t" />
        </>
      )}

      <div className="relative mx-auto w-full max-w-[var(--container-content)] px-6 py-24">
        <div className="max-w-3xl">
          <h1
            className={`font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl md:text-7xl ${
              hasImage ? "text-white" : "text-ink"
            }`}
          >
            {headline}
          </h1>
          <p
            className={`mt-6 max-w-xl font-sans text-lg leading-relaxed md:text-xl ${
              hasImage ? "text-white/90" : "text-ink-soft"
            }`}
          >
            {subtext}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/donate">Donate now</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className={
                hasImage ? "border-white/40 bg-white/10 text-white hover:bg-white/20" : ""
              }
            >
              <Link href="/impact">See our impact</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
