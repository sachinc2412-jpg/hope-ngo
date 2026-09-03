import type { Allocation } from "@/sanity/types";

/**
 * "How your money helps" — allocation bars. Percentages come from the
 * transparency singleton (editor-set), never invented here. Omitted if unset.
 */
export function HowMoneyHelps({ allocations }: { allocations?: Allocation[] }) {
  if (!allocations || allocations.length === 0) return null;

  return (
    <section className="mx-auto max-w-[var(--container-content)] px-6 py-24 md:py-32">
      <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-16">
        <div>
          <p className="text-ink-faint font-sans text-sm tracking-wide uppercase">
            How your money helps
          </p>
          <h2 className="font-display text-ink mt-3 text-4xl leading-tight tracking-tight md:text-5xl">
            Every dollar, accounted for.
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          {allocations.map((a) => (
            <div key={a.label}>
              <div className="flex items-baseline justify-between">
                <span className="text-ink font-sans text-base">{a.label}</span>
                <span className="font-display text-ink text-2xl">{a.percent}%</span>
              </div>
              <div className="bg-line mt-2 h-2 w-full overflow-hidden rounded-full">
                <div
                  className="bg-accent h-full rounded-full"
                  style={{ width: `${Math.min(100, Math.max(0, a.percent))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
