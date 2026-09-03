import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SanityImage } from "@/components/sanity/SanityImage";
import type { FeaturedStory } from "@/sanity/types";

/**
 * Human story section — introduce one real person before any statistics. Problem
 * told through a life, not a number. Hidden entirely if no featured story is set
 * (better to omit than show an empty frame).
 */
export function HumanStory({ story }: { story?: FeaturedStory }) {
  if (!story) return null;

  const name = story.personName || story.title;

  return (
    <section className="mx-auto max-w-[var(--container-content)] px-6 py-24 md:py-32">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="bg-line relative aspect-[4/5] overflow-hidden rounded-lg">
          <SanityImage
            image={story.heroImage}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-ink-faint font-sans text-sm tracking-wide uppercase">
            A story of change
          </p>
          <h2 className="font-display text-ink mt-3 text-4xl leading-tight tracking-tight md:text-5xl">
            Meet {name}.
          </h2>
          {story.excerpt && (
            <p className="text-ink-soft mt-5 font-sans text-lg leading-relaxed">
              {story.excerpt}
            </p>
          )}
          <Button asChild variant="secondary" size="lg" className="mt-8">
            <Link href={`/stories/${story.slug}`}>Read {name}&rsquo;s story</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
