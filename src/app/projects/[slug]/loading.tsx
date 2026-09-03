/** Loading skeleton for a project detail page (on-demand rendered slugs). */
export default function ProjectLoading() {
  return (
    <article>
      <div className="bg-line h-[52vh] min-h-[360px] w-full animate-pulse" />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="bg-line h-3 w-28 animate-pulse rounded" />
        <div className="bg-line mt-3 h-10 w-3/4 animate-pulse rounded" />
        <div className="mt-6 space-y-3">
          <div className="bg-line h-4 w-full animate-pulse rounded" />
          <div className="bg-line h-4 w-5/6 animate-pulse rounded" />
          <div className="bg-line h-4 w-4/6 animate-pulse rounded" />
        </div>
      </div>
    </article>
  );
}
