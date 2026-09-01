/**
 * Day 1 placeholder home. Its only job: prove the fonts, tokens, and build all
 * work end-to-end. The real 13-section homepage is built Days 5–8 and replaces
 * this entirely. Do not grow this file — it is scaffolding, not the product.
 */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-6 px-6">
      <p className="text-ink-faint font-sans text-sm tracking-wide uppercase">
        Day 1 · foundations
      </p>
      <h1 className="font-display text-ink text-5xl leading-[1.05] tracking-tight sm:text-6xl">
        Together, we can change what tomorrow looks like.
      </h1>
      <p className="text-ink-soft max-w-xl font-sans text-lg leading-relaxed">
        Every contribution helps create access to opportunity, dignity and a better future
        for communities that need it most.
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <span className="bg-accent text-accent-ink rounded-sm px-5 py-3 text-sm font-medium">
          Donate now
        </span>
        <span className="border-line text-ink rounded-sm border px-5 py-3 text-sm font-medium">
          See our impact
        </span>
      </div>
    </main>
  );
}
