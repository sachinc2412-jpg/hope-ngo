import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * SERVICE-ROLE client. Bypasses RLS entirely — root access. NEVER import this
 * into a client component. The `server-only` import above makes the build fail
 * if anyone tries. Use only in server routes/actions that must write money data
 * (donations, webhook processing) after their own validation.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
