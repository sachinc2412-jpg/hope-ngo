import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Admin gate. Used by the /admin layout so every admin page is protected.
 * Redirects: not signed in -> sign-in; signed in but not admin -> home.
 * This is the role gate; RLS + the admin_* SQL functions are the data backstop.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?redirect=/admin");

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") redirect("/");

  // Enforce 2FA step-up: if this admin has enrolled MFA but the current session
  // is only aal1, send them to /verify. redirect() throws NEXT_REDIRECT, so it
  // MUST run OUTSIDE the try/catch — otherwise the catch swallows it and the
  // redirect silently never happens (that was the bug).
  let needsStepUp = false;
  try {
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    needsStepUp = !!aal && aal.nextLevel === "aal2" && aal.currentLevel === "aal1";
  } catch {
    needsStepUp = false; // MFA status unavailable — don't lock out.
  }
  if (needsStepUp) redirect("/verify");

  return user;
}
