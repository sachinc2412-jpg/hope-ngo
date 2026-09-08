import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Record an admin mutation in audit_log. Inserts via the service-role client
 * because audit_log is insert-restricted by RLS (admin-read only). Never throws
 * — a failed audit write must not break the action it's recording.
 */
export async function logAudit(entry: {
  action: string;
  entity?: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const admin = createAdminClient();
    await admin.from("audit_log").insert({
      actor_user_id: user?.id ?? null,
      action: entry.action,
      entity: entry.entity ?? null,
      entity_id: entry.entityId ?? null,
      metadata: entry.metadata ?? null,
    });
  } catch (err) {
    console.error("audit log failed:", err);
  }
}
