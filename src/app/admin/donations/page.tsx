import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { formatAed } from "@/lib/validation/donation";

export const metadata = { title: "Donations — Admin" };

const PAGE_SIZE = 20;
const STATUSES = ["all", "succeeded", "pending", "failed", "refunded"] as const;

type Row = {
  id: string;
  created_at: string;
  amount_cents: number;
  designation: string;
  status: string;
  reference: string;
  is_anonymous: boolean;
  donor_email: string | null;
  donor_name: string | null;
};

/** Server-side search + filter + pagination over the admin_donations view. */
export default async function AdminDonationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const safeQ = q.replace(/[,()%*]/g, ""); // keep the .or() filter safe
  const status = STATUSES.includes(sp.status as (typeof STATUSES)[number])
    ? (sp.status as string)
    : "all";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();
  let query = supabase
    .from("admin_donations")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);
  if (status !== "all") query = query.eq("status", status);
  if (safeQ)
    query = query.or(
      `reference.ilike.%${safeQ}%,donor_email.ilike.%${safeQ}%,donor_name.ilike.%${safeQ}%`
    );

  const { data, count } = await query;
  const rows = (data ?? []) as Row[];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const exportHref = `/admin/donations/export?q=${encodeURIComponent(q)}&status=${status}`;
  const pageHref = (p: number) =>
    `/admin/donations?q=${encodeURIComponent(q)}&status=${status}&page=${p}`;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <form method="get" className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-ink-faint font-sans text-xs">Search</span>
            <input
              name="q"
              defaultValue={q}
              placeholder="Reference, email, or name"
              className="input !h-10 w-64"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-ink-faint font-sans text-xs">Status</span>
            <select name="status" defaultValue={status} className="input !h-10 w-40">
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" size="sm" variant="secondary">
            Filter
          </Button>
        </form>
        <Button asChild size="sm" variant="secondary">
          <a href={exportHref}>Export CSV</a>
        </Button>
      </div>

      <p className="text-ink-faint mt-4 font-sans text-sm">
        {total} donation{total === 1 ? "" : "s"}
        {status !== "all" ? ` · ${status}` : ""}
        {q ? ` · "${q}"` : ""}
      </p>

      {rows.length === 0 ? (
        <p className="text-ink-faint mt-8 font-sans">No matching donations.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-line text-ink-faint border-b text-left font-sans text-xs uppercase">
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Donor</th>
                <th className="py-3 pr-4">Amount</th>
                <th className="py-3 pr-4">Cause</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3">Reference</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-line border-b font-sans text-sm">
                  <td className="text-ink-soft py-3 pr-4 whitespace-nowrap">
                    {new Date(r.created_at).toLocaleDateString("en-AE", {
                      day: "numeric",
                      month: "short",
                      year: "2-digit",
                    })}
                  </td>
                  <td className="text-ink py-3 pr-4">
                    {r.is_anonymous ? "Anonymous" : r.donor_name || r.donor_email || "—"}
                  </td>
                  <td className="text-ink py-3 pr-4 font-medium whitespace-nowrap">
                    {formatAed(r.amount_cents)}
                  </td>
                  <td className="text-ink-soft py-3 pr-4">{r.designation}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={
                        r.status === "succeeded"
                          ? "text-success"
                          : r.status === "failed"
                            ? "text-danger"
                            : "text-ink-faint"
                      }
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="text-ink-faint py-3 font-mono text-xs">{r.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" disabled={page <= 1}>
            <Link href={pageHref(Math.max(1, page - 1))}>&larr; Prev</Link>
          </Button>
          <span className="text-ink-faint font-sans text-sm">
            Page {page} of {totalPages}
          </span>
          <Button asChild variant="ghost" size="sm" disabled={page >= totalPages}>
            <Link href={pageHref(Math.min(totalPages, page + 1))}>Next &rarr;</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
