import { notFound } from "next/navigation";
import Link from "next/link";
import { sanityFetch } from "@/sanity/fetch";
import { projectBySlugQuery, projectSlugsQuery } from "@/sanity/queries";
import { SanityImage } from "@/components/sanity/SanityImage";
import { PortableTextRenderer } from "@/components/sanity/PortableTextRenderer";
import { Button } from "@/components/ui/button";
import type { ProjectDetail } from "@/sanity/types";

/** Pre-render published project slugs at build; on error, none (render on demand). */
export async function generateStaticParams() {
  try {
    const slugs = await sanityFetch<string[]>({
      query: projectSlugsQuery,
      tags: ["project"],
    });
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

async function getProject(slug: string): Promise<ProjectDetail | null> {
  try {
    return await sanityFetch<ProjectDetail | null>({
      query: projectBySlugQuery,
      params: { slug },
      tags: ["project"],
    });
  } catch (err) {
    console.error("Failed to load project:", err);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project — Hope" };
  return {
    title: `${project.title} — Hope`,
    description: project.summary,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <article>
      <div className="bg-line relative h-[52vh] min-h-[360px] w-full">
        <SanityImage
          image={project.heroImage}
          sizes="100vw"
          priority
          className="object-cover"
        />
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16">
        {project.location && (
          <p className="text-ink-faint font-sans text-xs tracking-wide uppercase">
            {project.location}
          </p>
        )}
        <h1 className="font-display text-ink mt-2 text-4xl leading-tight tracking-tight md:text-5xl">
          {project.title}
        </h1>
        {project.summary && (
          <p className="text-ink-soft mt-5 font-sans text-xl leading-relaxed">
            {project.summary}
          </p>
        )}

        {project.body && (
          <div className="mt-10">
            <PortableTextRenderer value={project.body} />
          </div>
        )}

        <div className="border-line mt-12 border-t pt-8">
          <Button asChild size="lg">
            <Link href="/donate">Support this project</Link>
          </Button>
          {/* Funding progress (raised / goal) arrives Day 9 from Postgres. */}
        </div>
      </div>
    </article>
  );
}
