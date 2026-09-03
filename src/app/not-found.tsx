import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Branded 404 — matches the design system instead of Next's default. */
export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-start justify-center px-6 py-24">
      <p className="text-ink-faint font-sans text-sm tracking-wide uppercase">404</p>
      <h1 className="font-display text-ink mt-3 text-4xl leading-tight tracking-tight md:text-5xl">
        This page has moved on.
      </h1>
      <p className="text-ink-soft mt-4 font-sans text-lg leading-relaxed">
        The page you&rsquo;re looking for doesn&rsquo;t exist or was moved. Let&rsquo;s
        get you back to the work that matters.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/">Back home</Link>
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link href="/projects">See projects</Link>
        </Button>
      </div>
    </section>
  );
}
