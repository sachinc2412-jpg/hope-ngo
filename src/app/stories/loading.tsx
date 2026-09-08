/** Loading skeleton for the stories index (functional pulse; off under
 *  prefers-reduced-motion via the global rule). */
export default function StoriesLoading() {
  return (
    <section className="mx-auto max-w-[var(--container-content)] px-6 py-20 md:py-28">
      <div className="bg-line h-12 w-72 animate-pulse rounded" />
      <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="bg-line aspect-[4/5] animate-pulse rounded-lg" />
            <div className="bg-line mt-4 h-3 w-24 animate-pulse rounded" />
            <div className="bg-line mt-3 h-6 w-3/4 animate-pulse rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}
