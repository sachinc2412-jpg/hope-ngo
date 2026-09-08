import { notFound } from "next/navigation";
import Link from "next/link";
import { sanityFetch } from "@/sanity/fetch";
import { projectBySlugQuery, projectSlugsQuery } from "@/sanity/queries";
import { SanityImage } from "@/components/sanity/SanityImage";
import { PortableTextRenderer } from "@/components/sanity/PortableTextRenderer";
import { Button } from "@/components/ui/button";
import { FundingBar } from "@/components/project/FundingBar";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import { ProjectVideo } from "@/components/project/ProjectVideo";
import { ProjectUpdates } from "@/components/project/ProjectUpdates";
import { getFundingBySlugs } from "@/lib/donations/funding";
import { getImpactUpdatesForSlugs } from "@/lib/donations/updates";
import type { ProjectDetail } from "@/sanity/types";
import { urlFor } from "@/sanity/image";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";

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
  const ogImage = project.heroImage
    ? urlFor(project.heroImage).width(1200).height(630).fit("crop").url()
    : undefined;
  return {
    title: `${project.title} — Hope`,
    description: project.summary,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary,
      url: `/projects/${slug}`,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
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

  const [funding, updates] = await Promise.all([
    getFundingBySlugs([slug]).then((m) => m.get(slug)),
    getImpactUpdatesForSlugs([slug]),
  ]);

  const ogImage = project.heroImage
    ? urlFor(project.heroImage).width(1200).height(630).fit("crop").url()
    : undefined;

  return (
    <article>
      <JsonLd
        data={articleJsonLd({
          title: project.title,
          description: project.summary,
          image: ogImage,
          path: `/projects/${project.slug}`,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
          { name: project.title, path: `/projects/${project.slug}` },
        ])}
      />
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

        <ProjectVideo url={project.video} />
        <ProjectGallery images={project.gallery} />

        <div className="border-line mt-12 border-t pt-8">
          {funding && (
            <div className="mb-6">
              <FundingBar
                raisedCents={funding.raisedCents}
                goalCents={funding.goalCents ?? undefined}
                currency={funding.currency}
              />
            </div>
          )}
          <Button asChild size="lg">
            <Link href={`/donate?project=${project.slug}`}>Support this project</Link>
          </Button>
        </div>

        <ProjectUpdates updates={updates} />
      </div>
    </article>
  );
}
