import { SanityImage } from "@/components/sanity/SanityImage";
import type { ImpactUpdateData } from "@/sanity/types";

/** Public "Latest updates" section on a project page. Hidden if none. */
export function ProjectUpdates({ updates }: { updates: ImpactUpdateData[] }) {
  if (updates.length === 0) return null;
  return (
    <div className="border-line mt-12 border-t pt-10">
      <h2 className="text-ink font-display text-2xl">Latest updates</h2>
      <ul className="mt-6 flex flex-col gap-5">
        {updates.map((u) => (
          <li key={u._id} className="flex gap-4">
            {u.image && (
              <div className="bg-line relative hidden size-20 shrink-0 overflow-hidden rounded-md sm:block">
                <SanityImage image={u.image} sizes="80px" className="object-cover" />
              </div>
            )}
            <div>
              <p className="text-ink font-sans font-medium">{u.title}</p>
              {u.publishedAt && (
                <p className="text-ink-faint mt-1 font-sans text-xs">
                  {new Date(u.publishedAt).toLocaleDateString("en-AE", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
