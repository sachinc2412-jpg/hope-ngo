import Image from "next/image";
/**
 * Preloader overlay. CSS-driven fade-out (no JS dependency) so it can NEVER trap
 * content if scripts fail. Fades away shortly after first paint; under
 * prefers-reduced-motion the global rule collapses the animation to ~instant.
 * The .preloader keyframes live in globals.css.
 */
export function Preloader() {
  return (
    <div aria-hidden className="preloader">
      <Image
        src="/hope-mark.png"
        alt="Hope"
        width={96}
        height={94}
        priority
        className="h-24 w-auto"
      />
    </div>
  );
}
