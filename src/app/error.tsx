"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Route error boundary — catches render/data errors in any route and shows a
 * branded recovery screen instead of a raw stack trace. `reset()` retries the
 * segment. Logs to the console (wire to real error tracking later).
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-start justify-center px-6 py-24">
      <p className="text-ink-faint font-sans text-sm tracking-wide uppercase">
        Something went wrong
      </p>
      <h1 className="text-ink font-display mt-3 text-4xl leading-tight tracking-tight md:text-5xl">
        We hit a snag.
      </h1>
      <p className="text-ink-soft mt-4 font-sans text-lg leading-relaxed">
        This isn&rsquo;t on you. Try again, or head back home — your data is safe.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={reset} size="lg">
          Try again
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </section>
  );
}
