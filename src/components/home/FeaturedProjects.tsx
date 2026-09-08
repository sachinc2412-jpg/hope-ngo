import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project/ProjectCard";
import type { ProjectCardData } from "@/sanity/types";
import type { Funding } from "@/lib/donations/funding";

/** Featured projects grid. Funding numbers arrive Day 9; cards show pending bars. */
export function FeaturedProjects({
  projects,
  funding,
}: {
  projects: ProjectCardData[];
  funding: Map<string, Funding>;
}) {
  if (projects.length === 0) return null;

  return (
    <section className="border-line border-t">
      <div className="mx-auto max-w-[var(--container-content)] px-6 py-24 md:py-32">
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-ink-faint font-sans text-sm tracking-wide uppercase">
              Featured projects
            </p>
            <h2 className="font-display text-ink mt-3 text-4xl leading-tight tracking-tight md:text-5xl">
              Where your support goes to work.
            </h2>
          </div>
          <Button asChild variant="ghost" className="hidden shrink-0 sm:inline-flex">
            <Link href="/projects">View all &rarr;</Link>
          </Button>
        </div>

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
      </div>
    </section>
  );
}
