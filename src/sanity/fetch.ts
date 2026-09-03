import { client } from "@/sanity/client";

/**
 * Thin fetch wrapper that attaches Next cache tags. Content is cached until a
 * tag is invalidated by the /api/revalidate webhook (Day 4). One tag per content
 * type is enough for now.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags,
}: {
  query: string;
  params?: Record<string, unknown>;
  tags: string[];
}): Promise<T> {
  return client.fetch<T>(query, params, { next: { tags } });
}
