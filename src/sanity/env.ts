/** Sanity project config from env, with hard guards so a misconfigured
 *  deploy fails loudly at startup instead of silently fetching nothing. */
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

// Dataset defaults to "production" — the near-universal value — so a missing
// env var can't blank-fail the build (projectId has no safe default, stays required).
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID"
);

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) throw new Error(errorMessage);
  return v;
}
