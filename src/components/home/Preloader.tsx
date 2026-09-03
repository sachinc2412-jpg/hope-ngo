/**
 * Preloader shell — presentational only. The wordmark overlay that greets first
 * load. It is intentionally NOT mounted yet: without animation it would just
 * flash for a frame, which is worse than nothing. Day 32 mounts it and adds the
 * smooth fade-out (respecting reduced-motion). Kept here so that work has a home.
 */
export function Preloader() {
  return (
    <div
      aria-hidden
      className="bg-bg fixed inset-0 z-[100] flex items-center justify-center"
    >
      <span className="font-display text-ink text-4xl tracking-tight">Hope</span>
    </div>
  );
}
