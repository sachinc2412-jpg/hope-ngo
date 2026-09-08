import { createClient } from "@/lib/supabase/server";

export type Funding = {
  raisedCents: number;
  goalCents: number | null;
  currency: string;
};

/**
 * Live funding for a set of project slugs. Reads projects + their derived
 * project_stats from Postgres (both public-readable by RLS). Joined to Sanity
 * content by slug in the calling page. Returns a Map slug -> funding; missing
 * slugs simply aren't in the map (card shows the pending bar).
 */
export async function getFundingBySlugs(slugs: string[]): Promise<Map<string, Funding>> {
  const map = new Map<string, Funding>();
  if (slugs.length === 0) return map;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("slug, goal_cents, currency, project_stats(raised_cents)")
      .in("slug", slugs);
    if (error || !data) return map;

    for (const row of data as Array<{
      slug: string;
      goal_cents: number | null;
      currency: string | null;
      project_stats: { raised_cents: number } | { raised_cents: number }[] | null;
    }>) {
      const stats = Array.isArray(row.project_stats)
        ? row.project_stats[0]
        : row.project_stats;
      map.set(row.slug, {
        raisedCents: stats?.raised_cents ?? 0,
        goalCents: row.goal_cents,
        currency: row.currency ?? "AED",
      });
    }
  } catch (err) {
    console.error("Failed to load funding:", err);
  }
  return map;
}
