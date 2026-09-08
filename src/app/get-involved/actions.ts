"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const volunteerSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.email("Enter a valid email"),
  interest: z.string().max(80).optional(),
  message: z.string().max(2000).optional(),
});

/** Public volunteer application. Inserts to `volunteers` — RLS allows anyone to
 *  INSERT (vol_public_insert) but only admins to READ. Validated server-side. */
export async function submitVolunteerAction(input: {
  name: string;
  email: string;
  interest?: string;
  message?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const parsed = volunteerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("volunteers").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    interest: parsed.data.interest || null,
    message: parsed.data.message || null,
  });
  if (error) return { ok: false, error: "Could not submit. Please try again." };
  return { ok: true };
}
