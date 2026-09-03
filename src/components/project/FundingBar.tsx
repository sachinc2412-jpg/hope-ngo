/**
 * Funding progress bar. Built now, fed real numbers Day 9 (Postgres: sum of
 * succeeded donations vs goal, joined by slug). Until then it renders a neutral
 * "pending" state — NEVER invented dollar figures. Showing fake funding on a
 * trust-driven NGO site is the exact thing this project refuses to do.
 */
export function FundingBar({
  raisedCents,
  goalCents,
  currency = "USD",
}: {
  raisedCents?: number;
  goalCents?: number;
  currency?: string;
}) {
  const hasData =
    typeof raisedCents === "number" && typeof goalCents === "number" && goalCents > 0;

  if (!hasData) {
    return (
      <div className="mt-4">
        <div className="bg-line h-2 w-full rounded-full" />
        <p className="text-ink-faint mt-2 font-sans text-xs">
          Live funding progress coming soon
        </p>
      </div>
    );
  }

  const pct = Math.min(100, Math.round((raisedCents! / goalCents!) * 100));
  const fmt = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(cents / 100);

  return (
    <div className="mt-4">
      <div className="bg-line h-2 w-full overflow-hidden rounded-full">
        <div className="bg-accent h-full rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 flex items-center justify-between font-sans text-xs">
        <span className="text-ink font-medium">{fmt(raisedCents!)} raised</span>
        <span className="text-ink-faint">of {fmt(goalCents!)} goal</span>
      </div>
    </div>
  );
}
