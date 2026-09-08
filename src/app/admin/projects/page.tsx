import { createClient } from "@/lib/supabase/server";
import { ProjectRow } from "@/components/admin/ProjectRow";
import { AddProject } from "@/components/admin/AddProject";

export const metadata = { title: "Projects — Admin" };

type ProjectRowData = {
  id: string;
  slug: string;
  status: string;
  goal_cents: number | null;
  project_stats: { raised_cents: number } | { raised_cents: number }[] | null;
};

/** Admin project management — financial fields (goal/status) live here; content
 *  edits deep-link to Sanity Studio. No duplicated CMS. */
export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("id, slug, status, goal_cents, project_stats(raised_cents)")
    .order("created_at", { ascending: false });
  const projects = (data ?? []) as ProjectRowData[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-ink-soft font-sans text-sm">
          Edit funding goal + status here. Titles, images and descriptions live in Sanity
          Studio.
        </p>
        <AddProject />
      </div>

      {projects.length === 0 ? (
        <p className="text-ink-faint mt-8 font-sans">
          No project rows yet. Add one (and create its content in Studio with the same
          slug).
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {projects.map((p) => {
            const stats = Array.isArray(p.project_stats)
              ? p.project_stats[0]
              : p.project_stats;
            return (
              <ProjectRow
                key={p.id}
                id={p.id}
                slug={p.slug}
                status={p.status}
                goalCents={p.goal_cents}
                raisedCents={stats?.raised_cents ?? 0}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
