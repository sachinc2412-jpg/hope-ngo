import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Audit log — Admin" };

type AuditRow = {
  id: string;
  action: string;
  entity: string | null;
  created_at: string;
  users: { email: string | null } | { email: string | null }[] | null;
};

/** Audit log — every recorded admin mutation. Admin-read via RLS. */
export default async function AdminAuditPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("audit_log")
    .select("id, action, entity, created_at, users(email)")
    .order("created_at", { ascending: false })
    .limit(100);
  const rows = (data ?? []) as AuditRow[];

  return (
    <div>
      <p className="text-ink-soft font-sans text-sm">
        Every admin change is recorded here (most recent first).
      </p>
      {rows.length === 0 ? (
        <p className="text-ink-faint mt-8 font-sans">No activity yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr className="border-line text-ink-faint border-b text-left font-sans text-xs uppercase">
                <th className="py-3 pr-4">When</th>
                <th className="py-3 pr-4">Who</th>
                <th className="py-3 pr-4">Action</th>
                <th className="py-3">Entity</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const u = Array.isArray(r.users) ? r.users[0] : r.users;
                return (
                  <tr key={r.id} className="border-line border-b font-sans text-sm">
                    <td className="text-ink-soft py-3 pr-4 whitespace-nowrap">
                      {new Date(r.created_at).toLocaleString("en-AE", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="text-ink py-3 pr-4">{u?.email ?? "—"}</td>
                    <td className="text-ink py-3 pr-4 font-mono text-xs">{r.action}</td>
                    <td className="text-ink-soft py-3">{r.entity ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
