import { sanityFetch } from "@/sanity/fetch";
import { impactUpdatesForSlugsQuery } from "@/sanity/queries";
import type { ImpactUpdateData } from "@/sanity/types";

/** Sanity project updates for the projects a donor has supported. */
export async function getImpactUpdatesForSlugs(
  slugs: string[]
): Promise<ImpactUpdateData[]> {
  const unique = [...new Set(slugs)].filter(Boolean);
  if (unique.length === 0) return [];
  try {
    return await sanityFetch<ImpactUpdateData[]>({
      query: impactUpdatesForSlugsQuery,
      params: { slugs: unique },
      tags: ["projectUpdate"],
    });
  } catch (err) {
    console.error("Failed to load impact updates:", err);
    return [];
  }
}
