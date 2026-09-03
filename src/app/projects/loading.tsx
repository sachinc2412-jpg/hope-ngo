/**
 * Loading skeleton for the projects index. The pulse is functional loading
 * feedback (disabled under prefers-reduced-motion by the global rule), not the
 * decorative scroll motion deferred to Days 32–34.
 */
export default function ProjectsLoading() {
  return (
    <section className="mx-auto max-w-[var(--container-content)] px-6 py-20 md:py-28">
      <div className="bg-line h-12 w-64 animate-pulse rounded" />
      <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="bg-line aspect-[4/3] animate-pulse rounded-lg" />
            <div className="bg-line mt-4 h-3 w-24 animate-pulse rounded" />
            <div className="bg-line mt-3 h-6 w-3/4 animate-pulse rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}
