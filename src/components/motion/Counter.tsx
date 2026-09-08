"use client";

import { useEffect, useRef } from "react";

/**
 * Count-up via requestAnimationFrame + IntersectionObserver (no GSAP). SSR / no-JS
 * / reduced-motion all show the final number; only motion-OK users see it tick.
 * Writes via ref -> no re-renders.
 */
export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.unobserve(el);
        const duration = 1800;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
          el.textContent = Math.floor(eased * value).toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = value.toLocaleString() + suffix;
        };
        requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, suffix]);

  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}
