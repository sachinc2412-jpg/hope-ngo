import Link from "next/link";
import { SanityImage } from "@/components/sanity/SanityImage";
import type { StoryCardData } from "@/sanity/types";

/** Editorial story cards. Renders nothing if no stories are published. */
export function StoriesOfChange({ stories }: { stories: StoryCardData[] }) {
  if (stories.length === 0) return null;

  return (
    <section className="border-line bg-bg-raised border-t">
      <div className="mx-auto max-w-[var(--container-content)] px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="text-ink-faint font-sans text-sm tracking-wide uppercase">
            Stories of change
          </p>
          <h2 className="font-display text-ink mt-3 text-4xl leading-tight tracking-tight md:text-5xl">
            The people behind the work.
          </h2>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((s) => (
            <Link key={s._id} href={`/stories/${s.slug}`} className="group block">
              <div className="bg-line relative aspect-[4/5] overflow-hidden rounded-lg">
                <SanityImage
                  image={s.heroImage}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              {s.personName && (
                <p className="text-ink-faint mt-4 font-sans text-xs tracking-wide uppercase">
                  {s.personName}
                </p>
              )}
              <h3 className="font-display text-ink mt-1 text-2xl">{s.title}</h3>
              {s.excerpt && (
                <p className="text-ink-soft mt-2 font-sans text-sm leading-relaxed">
                  {s.excerpt}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
