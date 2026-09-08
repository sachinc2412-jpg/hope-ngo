/** A single dashboard metric. */
export function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="border-line bg-bg-raised rounded-lg border p-6">
      <p className="text-ink-faint font-sans text-xs tracking-wide uppercase">{label}</p>
      <p className="text-ink font-display mt-2 text-3xl tracking-tight md:text-4xl">
        {value}
      </p>
      {sub && <p className="text-ink-faint mt-1 font-sans text-sm">{sub}</p>}
    </div>
  );
}
