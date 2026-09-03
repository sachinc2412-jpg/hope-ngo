import Link from "next/link";
import { Button } from "@/components/ui/button";

const FALLBACK_HEADLINE = "Your next decision could change someone's tomorrow.";

/**
 * Final emotional CTA band before the footer. Copy from the homepage singleton
 * with a fallback. Deep-denim accent background for weight.
 */
export function FinalCTA({ headline, text }: { headline?: string; text?: string }) {
  return (
    <section className="bg-accent">
      <div className="mx-auto max-w-[var(--container-content)] px-6 py-28 text-center md:py-36">
        <h2 className="font-display text-accent-ink mx-auto max-w-3xl text-4xl leading-tight tracking-tight md:text-6xl">
          {headline || FALLBACK_HEADLINE}
        </h2>
        {text && (
          <p className="text-accent-ink/85 mx-auto mt-6 max-w-xl font-sans text-lg leading-relaxed">
            {text}
          </p>
        )}
        <Button
          asChild
          size="lg"
          className="bg-accent-ink text-accent hover:bg-accent-ink/90 mt-10"
        >
          <Link href="/donate">Donate now</Link>
        </Button>
      </div>
    </section>
  );
}
