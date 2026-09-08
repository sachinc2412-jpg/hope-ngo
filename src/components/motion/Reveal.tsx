"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Fade + rise on scroll — native IntersectionObserver + CSS (no GSAP). The hidden
 * initial state lives in CSS gated on `.js` + (prefers-reduced-motion:
 * no-preference), so: no-JS -> visible; reduced-motion -> visible; no flash
 * (the .js class is set by an inline script before paint).
 */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("is-visible");
            io.unobserve(el);
          }
        }
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={cn("reveal", className)}>
      {children}
    </div>
  );
}
