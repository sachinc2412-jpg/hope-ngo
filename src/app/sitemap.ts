import type { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/fetch";
import { projectSlugsQuery, storySlugsQuery } from "@/sanity/queries";
import { siteUrl } from "@/lib/seo";

/** Sitemap: static routes + dynamic project/story slugs from Sanity. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/projects",
    "/stories",
    "/impact",
    "/transparency",
    "/get-involved",
    "/about",
    "/contact",
    "/donate",
    "/legal/privacy",
    "/legal/terms",
    "/legal/donation-policy",
  ];

  let projectSlugs: string[] = [];
  let storySlugs: string[] = [];
  try {
    projectSlugs = await sanityFetch<string[]>({
      query: projectSlugsQuery,
      tags: ["project"],
    });
  } catch {}
  try {
    storySlugs = await sanityFetch<string[]>({
      query: storySlugsQuery,
      tags: ["story"],
    });
  } catch {}

  const now = new Date();
  return [
    ...staticPaths.map((p) => ({ url: `${siteUrl}${p}`, lastModified: now })),
    ...projectSlugs.map((s) => ({
      url: `${siteUrl}/projects/${s}`,
      lastModified: now,
    })),
    ...storySlugs.map((s) => ({
      url: `${siteUrl}/stories/${s}`,
      lastModified: now,
    })),
  ];
}
