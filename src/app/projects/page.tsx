import { sanityFetch } from "@/sanity/fetch";
import { allProjectsQuery } from "@/sanity/queries";
import { ProjectCard } from "@/components/project/ProjectCard";
import { getFundingBySlugs } from "@/lib/donations/funding";
import type { ProjectCardData } from "@/sanity/types";

export const metadata = {
  title: "Projects — Hope",
  description: "The work your donations make possible.",
};

async function getProjects(): Promise<ProjectCardData[]> {
  try {
    return await sanityFetch<ProjectCardData[]>({
      query: allProjectsQuery,
      tags: ["project"],
    });
  } catch (err) {
    // Resilience: a Sanity outage renders an empty state, never a 500.
    console.error("Failed to load projects:", err);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  const funding = await getFundingBySlugs(projects.map((p) => p.slug));

  return (
    <section className="mx-auto max-w-[var(--container-content)] px-6 py-20 md:py-28">
      <h1 className="font-display text-ink max-w-3xl text-5xl leading-tight tracking-tight md:text-6xl">
        Projects
      </h1>
      <p className="text-ink-soft mt-4 max-w-xl font-sans text-lg">
        The work your donations make possible.
      </p>

      {projects.length === 0 ? (
        <p className="text-ink-faint mt-16 font-sans">
          No projects published yet. Add one in the Studio and publish it.
        </p>
      ) : (
        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            const f = funding.get(p.slug);
            return (
              <ProjectCard
                key={p._id}
                project={p}
                raisedCents={f?.raisedCents}
                goalCents={f?.goalCents ?? undefined}
                currency={f?.currency}
              />
            );
          })}
        </div>
      )}
      {/* Funding bars show pending until Day 9 wires Postgres totals. */}
    </section>
  );
}
