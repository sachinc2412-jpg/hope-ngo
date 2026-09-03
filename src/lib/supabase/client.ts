import { createBrowserClient } from "@supabase/ssr";

/** Browser (client component) Supabase client. Uses the public anon key —
 *  all access is governed by RLS policies (Day 11). */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
