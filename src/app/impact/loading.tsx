/** Loading skeleton for the impact map page. */
export default function ImpactLoading() {
  return (
    <section className="mx-auto max-w-[var(--container-content)] px-6 py-20 md:py-28">
      <div className="bg-line h-3 w-32 animate-pulse rounded" />
      <div className="bg-line mt-3 h-12 w-2/3 animate-pulse rounded" />
      <div className="bg-line mt-12 h-[60vh] min-h-[420px] w-full animate-pulse rounded-lg" />
    </section>
  );
}
