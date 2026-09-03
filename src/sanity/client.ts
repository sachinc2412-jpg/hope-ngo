import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

/**
 * Read client for the public site. useCdn:false so tag-based revalidation
 * always re-fetches fresh content when a tag is invalidated (Next caches the
 * result; the CDN would add a second stale layer). Published docs on a public
 * dataset need no token.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});
