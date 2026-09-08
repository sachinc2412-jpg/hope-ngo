import { createClient } from "@/lib/supabase/server";
import { sanityFetch } from "@/sanity/fetch";
import { mapProjectsQuery } from "@/sanity/queries";

export type MapMarker = {
  slug: string;
  lat: number;
  lng: number;
  title: string;
  location?: string;
};

/**
 * Map markers = Postgres coords (active projects, public-readable) merged with
 * Sanity title/location by slug. Only projects with real coordinates appear.
 */
export async function getMapMarkers(): Promise<MapMarker[]> {
  try {
    const supabase = await createClient();
    const { data: rows } = await supabase
      .from("projects")
      .select("slug, lat, lng")
      .eq("status", "active")
      .not("lat", "is", null)
      .not("lng", "is", null);
    if (!rows || rows.length === 0) return [];

    const meta = await sanityFetch<{ slug: string; title: string; location?: string }[]>({
      query: mapProjectsQuery,
      tags: ["project"],
    });
    const metaBySlug = new Map(meta.map((m) => [m.slug, m]));

    return rows
      .map((r) => {
        const m = metaBySlug.get(r.slug);
        return {
          slug: r.slug,
          lat: Number(r.lat),
          lng: Number(r.lng),
          title: m?.title ?? r.slug,
          location: m?.location,
        };
      })
      .filter((m) => !Number.isNaN(m.lat) && !Number.isNaN(m.lng));
  } catch (err) {
    console.error("Failed to load map markers:", err);
    return [];
  }
}
