import Link from "next/link";
import { SanityImage } from "@/components/sanity/SanityImage";
import { FundingBar } from "@/components/project/FundingBar";
import type { ProjectCardData } from "@/sanity/types";

/**
 * Editorial project card. Reused by the homepage featured grid and the projects
 * index. Funding props are optional — omitted until Day 9 wires Postgres totals.
 */
export function ProjectCard({
  project,
  raisedCents,
  goalCents,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: {
  project: ProjectCardData;
  raisedCents?: number;
  goalCents?: number;
  sizes?: string;
}) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="bg-line relative aspect-[4/3] overflow-hidden rounded-lg">
        <SanityImage image={project.heroImage} sizes={sizes} className="object-cover" />
      </div>
      {project.location && (
        <p className="text-ink-faint mt-4 font-sans text-xs tracking-wide uppercase">
          {project.location}
        </p>
      )}
      <h3 className="font-display text-ink mt-1 text-2xl">{project.title}</h3>
      {project.summary && (
        <p className="text-ink-soft mt-2 font-sans text-sm leading-relaxed">
          {project.summary}
        </p>
      )}
      <FundingBar raisedCents={raisedCents} goalCents={goalCents} />
    </Link>
  );
}
