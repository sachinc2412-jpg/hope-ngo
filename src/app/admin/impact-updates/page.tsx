import { getAdminUpdates } from "@/lib/admin/content";
import { StudioLink } from "@/components/admin/StudioLink";

export const metadata = { title: "Impact updates — Admin" };

function fmt(d?: string) {
  return d
    ? new Date(d).toLocaleDateString("en-AE", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Unpublished";
}

/** Impact-updates INDEX. Authored in Studio (each tied to a project via
 *  relatedProject); this lists them and deep-links to edit. */
export default async function AdminUpdatesPage() {
  const updates = await getAdminUpdates();

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-ink-soft font-sans text-sm">
          Project updates are written in Sanity Studio, each linked to a project.
        </p>
        <StudioLink label="New update in Studio" />
      </div>

      {updates.length === 0 ? (
        <p className="text-ink-faint mt-8 font-sans">
          No published updates yet. Create one in Studio and link it to a project.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-2">
          {updates.map((u) => (
            <div
              key={u._id}
              className="border-line bg-bg-raised flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3"
            >
              <div>
                <p className="text-ink font-sans font-medium">{u.title}</p>
                <p className="text-ink-faint font-sans text-xs">
                  {u.project ? `Project: ${u.project} · ` : "No project · "}
                  {fmt(u.publishedAt)}
                </p>
              </div>
              <StudioLink id={u._id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
