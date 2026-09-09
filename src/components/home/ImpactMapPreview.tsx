import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Homepage teaser for the impact map. The full interactive Mapbox map lives on
 * /impact — we keep it off the homepage bundle for performance and link to it
 * with a polished CTA panel instead.
 */
export function ImpactMapPreview() {
  return (
    <section className="mx-auto max-w-[var(--container-content)] px-6 py-24 md:py-32">
      <div className="border-line bg-accent relative overflow-hidden rounded-lg">
        {/* subtle dotted world motif */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative grid gap-8 p-10 md:grid-cols-[1.4fr_1fr] md:items-center md:p-16">
          <div>
            <p className="font-sans text-sm tracking-wide text-white/70 uppercase">
              Where we work
            </p>
            <h2 className="font-display mt-3 text-4xl leading-tight tracking-tight text-white md:text-5xl">
              Every project, on the map.
            </h2>
            <p className="mt-5 max-w-md font-sans text-lg leading-relaxed text-white/85">
              See the communities your support reaches, plotted across the countries where
              we work. Select a location to explore the project.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gold text-gold-ink hover:bg-gold/90 mt-8"
            >
              <Link href="/impact">
                Explore the impact map
                <ArrowRight className="ml-2 size-4" strokeWidth={2} />
              </Link>
            </Button>
          </div>
          <div className="hidden justify-center md:flex">
            <MapPin className="size-28 text-white/25" strokeWidth={1} />
          </div>
        </div>
      </div>
    </section>
  );
}
