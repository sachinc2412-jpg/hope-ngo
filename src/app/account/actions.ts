"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const profileSchema = z.object({
  displayName: z.string().min(1, "Name is required").max(120),
  country: z.string().min(2, "Country is required").max(80),
});

/**
 * Update the signed-in donor's profile. Ownership is enforced server-side: we
 * read the session, then update only donor rows where user_id = this user. Uses
 * the admin client because donor writes are server-only by RLS (no client-side
 * update policy) — but scoped strictly to the caller's own rows.
 */
export async function updateProfileAction(input: {
  displayName: string;
  country: string;
}): Promise<{ ok: boolean; error?: string }> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("donors")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await admin
      .from("donors")
      .update({
        display_name: parsed.data.displayName,
        country: parsed.data.country,
      })
      .eq("user_id", user.id);
    if (error) return { ok: false, error: "Could not save profile" };
  } else {
    const { error } = await admin.from("donors").insert({
      user_id: user.id,
      email: user.email,
      display_name: parsed.data.displayName,
      country: parsed.data.country,
    });
    if (error) return { ok: false, error: "Could not save profile" };
  }

  revalidatePath("/account/profile");
  return { ok: true };
}
