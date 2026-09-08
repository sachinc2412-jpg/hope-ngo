"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/** Bottom-up clip wipe via CSS (no GSAP). Visible under no-JS / reduced-motion. */
export function MaskReveal({
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
      { rootMargin: "0px 0px -20% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={cn("mask", className)}>
      {children}
    </div>
  );
}
