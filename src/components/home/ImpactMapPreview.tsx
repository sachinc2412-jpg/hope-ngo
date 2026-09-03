import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Placeholder for the interactive Mapbox impact map. The real map (project pins,
 * click-to-reveal) is built Day 29 — it needs Postgres coordinates + a Mapbox
 * token. This is an honest placeholder that holds the section, not a fake map.
 */
export function ImpactMapPreview() {
  return (
    <section className="mx-auto max-w-[var(--container-content)] px-6 py-24 md:py-32">
      <div className="max-w-2xl">
        <p className="text-ink-faint font-sans text-sm tracking-wide uppercase">
          Where we work
        </p>
        <h2 className="font-display text-ink mt-3 text-4xl leading-tight tracking-tight md:text-5xl">
          Every project, on the map.
        </h2>
      </div>

      <div className="border-line bg-bg-raised mt-12 flex aspect-[16/9] w-full flex-col items-center justify-center rounded-lg border border-dashed text-center">
        <MapPin className="text-ink-faint size-8" strokeWidth={1.5} />
        <p className="text-ink-faint mt-4 font-sans text-sm">
          Interactive impact map — connects Day 29
        </p>
        <Button asChild variant="secondary" size="sm" className="mt-6">
          <Link href="/impact">Explore our impact</Link>
        </Button>
      </div>
    </section>
  );
}
