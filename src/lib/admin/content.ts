import { sanityFetch } from "@/sanity/fetch";
import { adminStoriesQuery, adminUpdatesQuery } from "@/sanity/queries";

export type AdminStory = {
  _id: string;
  title: string;
  personName?: string;
  slug?: string;
  project?: string;
  publishedAt?: string;
};

export type AdminUpdate = {
  _id: string;
  title: string;
  project?: string;
  projectSlug?: string;
  publishedAt?: string;
};

export async function getAdminStories(): Promise<AdminStory[]> {
  try {
    return await sanityFetch<AdminStory[]>({
      query: adminStoriesQuery,
      tags: ["story"],
    });
  } catch (err) {
    console.error("Failed to load stories:", err);
    return [];
  }
}

export async function getAdminUpdates(): Promise<AdminUpdate[]> {
  try {
    return await sanityFetch<AdminUpdate[]>({
      query: adminUpdatesQuery,
      tags: ["projectUpdate"],
    });
  } catch (err) {
    console.error("Failed to load updates:", err);
    return [];
  }
}
