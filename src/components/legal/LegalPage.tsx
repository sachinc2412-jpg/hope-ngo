/** Shared shell for legal pages — with a clear "template, replace me" banner so
 *  placeholder legal text is never mistaken for reviewed, authoritative terms. */
export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20 md:py-24">
      <h1 className="text-ink font-display text-4xl tracking-tight md:text-5xl">
        {title}
      </h1>
      <div className="border-danger/30 bg-danger/5 text-danger mt-6 rounded-sm border px-4 py-3 font-sans text-sm">
        Template only — replace with legal text reviewed by a qualified professional
        before launch. This is not legal advice.
      </div>
      <div className="text-ink-soft [&_h2]:text-ink [&_h2]:font-display mt-8 flex flex-col gap-4 font-sans leading-relaxed [&_h2]:mt-8 [&_h2]:text-2xl">
        {children}
      </div>
    </section>
  );
}
