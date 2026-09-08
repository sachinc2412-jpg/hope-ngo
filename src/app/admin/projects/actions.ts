"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { logAudit } from "@/lib/admin/audit";

const STATUSES = ["draft", "active", "funded", "closed"] as const;

const updateSchema = z.object({
  id: z.string().uuid(),
  goalAed: z.number().positive().max(100_000_000).nullable(),
  status: z.enum(STATUSES),
});

const createSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(96)
    .regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, hyphens only"),
  goalAed: z.number().positive().max(100_000_000).nullable(),
  status: z.enum(STATUSES),
});

/** Update a project's financial fields. Writes via the admin session (RLS
 *  admin policy permits it); page is already requireAdmin-gated. */
export async function updateProjectAction(input: {
  id: string;
  goalAed: number | null;
  status: (typeof STATUSES)[number];
}): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({
      goal_cents:
        parsed.data.goalAed === null ? null : Math.round(parsed.data.goalAed * 100),
      status: parsed.data.status,
    })
    .eq("id", parsed.data.id);
  if (error) return { ok: false, error: "Could not save project" };

  await logAudit({
    action: "project.update",
    entity: "project",
    entityId: parsed.data.id,
    metadata: { status: parsed.data.status, goalAed: parsed.data.goalAed },
  });

  revalidatePath("/admin/projects");
  return { ok: true };
}

/** Create the Postgres (financial) row for a project. Its content doc is made
 *  separately in Sanity Studio with the SAME slug (the join key). */
export async function createProjectAction(input: {
  slug: string;
  goalAed: number | null;
  status: (typeof STATUSES)[number];
}): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const parsed = createSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };

  const supabase = await createClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .order("created_at")
    .limit(1)
    .maybeSingle();
  if (!org) return { ok: false, error: "No organization found. Seed one first." };

  const { error } = await supabase.from("projects").insert({
    org_id: org.id,
    slug: parsed.data.slug,
    status: parsed.data.status,
    goal_cents:
      parsed.data.goalAed === null ? null : Math.round(parsed.data.goalAed * 100),
    currency: "AED",
  });
  if (error) {
    return {
      ok: false,
      error: error.message.includes("duplicate")
        ? "A project with that slug already exists"
        : "Could not create project",
    };
  }

  await logAudit({
    action: "project.create",
    entity: "project",
    metadata: {
      slug: parsed.data.slug,
      status: parsed.data.status,
      goalAed: parsed.data.goalAed,
    },
  });

  revalidatePath("/admin/projects");
  return { ok: true };
}
