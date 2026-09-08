"use client";

import { useEffect, useRef } from "react";
import { SanityImage } from "@/components/sanity/SanityImage";
import type { SanityImage as SanityImageType } from "@/sanity/types";

/**
 * Subtle scroll-linked hero scale via a throttled rAF scroll handler (no GSAP,
 * no ScrollTrigger). Scale-only so it can't reveal edge gaps. Off under
 * reduced-motion.
 */
export function HeroMedia({ image }: { image: SanityImageType }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // progress 0 (hero at top) -> 1 (hero scrolled one viewport up)
      const progress = Math.min(1, Math.max(0, -rect.top / vh));
      el.style.transform = `scale(${1 + progress * 0.08})`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 will-change-transform">
      <SanityImage image={image} sizes="100vw" priority className="object-cover" />
    </div>
  );
}
