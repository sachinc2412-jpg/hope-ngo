import Link from "next/link";
import { sanityFetch } from "@/sanity/fetch";
import { allStoriesQuery } from "@/sanity/queries";
import { SanityImage } from "@/components/sanity/SanityImage";
import type { StoryCardData } from "@/sanity/types";

export const metadata = {
  title: "Stories — Hope",
  description: "The people behind the work.",
};

async function getStories(): Promise<StoryCardData[]> {
  try {
    return await sanityFetch<StoryCardData[]>({
      query: allStoriesQuery,
      tags: ["story"],
    });
  } catch (err) {
    console.error("Failed to load stories:", err);
    return [];
  }
}

export default async function StoriesPage() {
  const stories = await getStories();
  return (
    <section className="mx-auto max-w-[var(--container-content)] px-6 py-20 md:py-28">
      <h1 className="text-ink font-display text-5xl leading-tight tracking-tight md:text-6xl">
        Stories of change
      </h1>
      <p className="text-ink-soft mt-4 max-w-xl font-sans text-lg">
        The people behind the work.
      </p>

      {stories.length === 0 ? (
        <p className="text-ink-faint mt-16 font-sans">No stories published yet.</p>
      ) : (
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
              <h2 className="text-ink font-display mt-1 text-2xl">{s.title}</h2>
              {s.excerpt && (
                <p className="text-ink-soft mt-2 font-sans text-sm leading-relaxed">
                  {s.excerpt}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
