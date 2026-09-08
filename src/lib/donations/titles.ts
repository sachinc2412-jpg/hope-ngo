import { sanityFetch } from "@/sanity/fetch";
import { groq } from "next-sanity";

/** Map project slug -> Sanity title, for showing project names in the dashboard. */
export async function getProjectTitles(slugs: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const unique = [...new Set(slugs)].filter(Boolean);
  if (unique.length === 0) return map;
  try {
    const rows = await sanityFetch<{ slug: string; title: string }[]>({
      query: groq`*[_type == "project" && slug.current in $slugs]{ "slug": slug.current, title }`,
      params: { slugs: unique },
      tags: ["project"],
    });
    for (const r of rows) map.set(r.slug, r.title);
  } catch (err) {
    console.error("Failed to load project titles:", err);
  }
  return map;
}
