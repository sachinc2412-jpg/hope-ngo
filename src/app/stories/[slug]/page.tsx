import { notFound } from "next/navigation";
import Link from "next/link";
import { sanityFetch } from "@/sanity/fetch";
import { storyBySlugQuery, storySlugsQuery } from "@/sanity/queries";
import { SanityImage } from "@/components/sanity/SanityImage";
import { PortableTextRenderer } from "@/components/sanity/PortableTextRenderer";
import { Button } from "@/components/ui/button";
import type { StoryDetail } from "@/sanity/types";
import { urlFor } from "@/sanity/image";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  try {
    const slugs = await sanityFetch<string[]>({
      query: storySlugsQuery,
      tags: ["story"],
    });
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

async function getStory(slug: string): Promise<StoryDetail | null> {
  try {
    return await sanityFetch<StoryDetail | null>({
      query: storyBySlugQuery,
      params: { slug },
      tags: ["story"],
    });
  } catch (err) {
    console.error("Failed to load story:", err);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) return { title: "Story — Hope" };
  const ogImage = story.heroImage
    ? urlFor(story.heroImage).width(1200).height(630).fit("crop").url()
    : undefined;
  return {
    title: `${story.title} — Hope`,
    description: story.excerpt,
    alternates: { canonical: `/stories/${slug}` },
    openGraph: {
      type: "article",
      title: story.title,
      description: story.excerpt,
      url: `/stories/${slug}`,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) notFound();

  const ogImage = story.heroImage
    ? urlFor(story.heroImage).width(1200).height(630).fit("crop").url()
    : undefined;

  return (
    <article>
      <JsonLd
        data={articleJsonLd({
          title: story.title,
          description: story.excerpt,
          image: ogImage,
          path: `/stories/${slug}`,
          publishedAt: story.publishedAt,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Stories", path: "/stories" },
          { name: story.title, path: `/stories/${slug}` },
        ])}
      />
      <div className="bg-line relative h-[56vh] min-h-[380px] w-full">
        <SanityImage
          image={story.heroImage}
          sizes="100vw"
          priority
          className="object-cover"
        />
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16">
        {story.personName && (
          <p className="text-ink-faint font-sans text-xs tracking-wide uppercase">
            {story.personName}
          </p>
        )}
        <h1 className="font-display text-ink mt-2 text-4xl leading-tight tracking-tight md:text-5xl">
          {story.title}
        </h1>
        {story.excerpt && (
          <p className="text-ink-soft mt-5 font-sans text-xl leading-relaxed">
            {story.excerpt}
          </p>
        )}

        {story.body && (
          <div className="mt-10">
            <PortableTextRenderer value={story.body} />
          </div>
        )}

        <div className="border-line mt-12 flex flex-wrap gap-3 border-t pt-8">
          {story.relatedProject && (
            <Button asChild variant="secondary">
              <Link href={`/projects/${story.relatedProject.slug}`}>
                See the project: {story.relatedProject.title}
              </Link>
            </Button>
          )}
          <Button asChild>
            <Link
              href={
                story.relatedProject
                  ? `/donate?project=${story.relatedProject.slug}`
                  : "/donate"
              }
            >
              Donate
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
