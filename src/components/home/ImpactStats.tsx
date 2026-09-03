import type { ImpactStatData } from "@/sanity/types";

/**
 * Impact statistics band. Static for now — the count-up-on-scroll animation is
 * Day 33. Numbers are formatted with locale separators. Renders nothing if no
 * stats exist (no empty scaffolding).
 */
export function ImpactStats({ stats }: { stats: ImpactStatData[] }) {
  if (stats.length === 0) return null;

  return (
    <section className="border-line bg-bg-raised border-y">
      <div className="mx-auto max-w-[var(--container-content)] px-6 py-20 md:py-24">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s._id}>
              <p className="font-display text-ink text-4xl tracking-tight md:text-5xl">
                {s.value.toLocaleString()}
                {s.suffix ?? ""}
              </p>
              <p className="text-ink-soft mt-2 font-sans text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
