import { getAdminStories } from "@/lib/admin/content";
import { StudioLink } from "@/components/admin/StudioLink";

export const metadata = { title: "Stories — Admin" };

function fmt(d?: string) {
  return d
    ? new Date(d).toLocaleDateString("en-AE", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Unpublished";
}

/** Stories management INDEX. Content is authored in Sanity Studio; this lists
 *  what's published and deep-links to edit. No duplicated CMS. */
export default async function AdminStoriesPage() {
  const stories = await getAdminStories();

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-ink-soft font-sans text-sm">
          Stories are written in Sanity Studio. This is your overview.
        </p>
        <StudioLink label="New story in Studio" />
      </div>

      {stories.length === 0 ? (
        <p className="text-ink-faint mt-8 font-sans">
          No published stories yet. Create one in Studio.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-2">
          {stories.map((s) => (
            <div
              key={s._id}
              className="border-line bg-bg-raised flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3"
            >
              <div>
                <p className="text-ink font-sans font-medium">{s.title}</p>
                <p className="text-ink-faint font-sans text-xs">
                  {s.personName ? `${s.personName} · ` : ""}
                  {s.project ? `Project: ${s.project} · ` : ""}
                  {fmt(s.publishedAt)}
                </p>
              </div>
              <StudioLink id={s._id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
