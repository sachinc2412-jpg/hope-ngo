import Link from "next/link";
import { SanityImage } from "@/components/sanity/SanityImage";
import type { ImpactUpdateData } from "@/sanity/types";

/** Updates from the projects a donor supports. Renders nothing if there are none. */
export function ImpactUpdates({ updates }: { updates: ImpactUpdateData[] }) {
  if (updates.length === 0) return null;

  return (
    <div className="mt-14">
      <h2 className="text-ink font-display text-2xl">Updates from your projects</h2>
      <ul className="mt-6 flex flex-col gap-4">
        {updates.map((u) => (
          <li
            key={u._id}
            className="border-line bg-bg-raised flex gap-4 rounded-lg border p-4"
          >
            {u.image && (
              <div className="bg-line relative hidden size-20 shrink-0 overflow-hidden rounded-md sm:block">
                <SanityImage image={u.image} sizes="80px" className="object-cover" />
              </div>
            )}
            <div className="min-w-0">
              {u.projectTitle && (
                <p className="text-ink-faint font-sans text-xs tracking-wide uppercase">
                  {u.projectTitle}
                </p>
              )}
              <p className="text-ink mt-1 font-sans font-medium">{u.title}</p>
              <div className="mt-2 flex items-center gap-3">
                {u.publishedAt && (
                  <span className="text-ink-faint font-sans text-xs">
                    {new Date(u.publishedAt).toLocaleDateString("en-AE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
                {u.projectSlug && (
                  <Link
                    href={`/projects/${u.projectSlug}`}
                    className="text-accent font-sans text-xs underline underline-offset-2"
                  >
                    View project
                  </Link>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
