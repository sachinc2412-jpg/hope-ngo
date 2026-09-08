import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/account/StatCard";
import { formatAed } from "@/lib/validation/donation";

export const metadata = { title: "Admin overview — Hope" };

type Overview = {
  total_raised_cents: number;
  donations_count: number;
  this_month_cents: number;
  donors_count: number;
  active_projects: number;
};

type RecentDonation = {
  id: string;
  amount_cents: number;
  status: string;
  reference: string;
  created_at: string;
  is_anonymous: boolean;
  donors:
    | { email: string | null; display_name: string | null }
    | { email: string | null; display_name: string | null }[]
    | null;
};

/** Admin overview — aggregate stats (via admin_overview RPC) + recent donations. */
export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const { data: overview } = await supabase.rpc("admin_overview");
  const o = (overview ?? {
    total_raised_cents: 0,
    donations_count: 0,
    this_month_cents: 0,
    donors_count: 0,
    active_projects: 0,
  }) as Overview;

  // Admin RLS lets an admin read all donations.
  const { data: recentData } = await supabase
    .from("donations")
    .select(
      "id, amount_cents, status, reference, created_at, is_anonymous, donors(email, display_name)"
    )
    .order("created_at", { ascending: false })
    .limit(10);
  const recent = (recentData ?? []) as RecentDonation[];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total raised" value={formatAed(o.total_raised_cents)} />
        <StatCard label="This month" value={formatAed(o.this_month_cents)} />
        <StatCard label="Donations" value={String(o.donations_count)} />
        <StatCard label="Donors" value={String(o.donors_count)} />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active projects" value={String(o.active_projects)} />
      </div>

      <h2 className="text-ink font-display mt-12 text-2xl">Recent donations</h2>
      {recent.length === 0 ? (
        <p className="text-ink-faint mt-4 font-sans">No donations yet.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-2">
          {recent.map((d) => {
            const donor = Array.isArray(d.donors) ? d.donors[0] : d.donors;
            const who = d.is_anonymous
              ? "Anonymous"
              : donor?.display_name || donor?.email || "—";
            return (
              <li
                key={d.id}
                className="border-line bg-bg-raised flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3"
              >
                <div>
                  <p className="text-ink font-sans text-sm font-medium">{who}</p>
                  <p className="text-ink-faint font-sans text-xs">
                    {new Date(d.created_at).toLocaleDateString("en-AE", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    &middot; {d.reference}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-ink font-sans text-sm font-medium">
                    {formatAed(d.amount_cents)}
                  </p>
                  <p
                    className={`font-sans text-xs ${
                      d.status === "succeeded"
                        ? "text-success"
                        : d.status === "failed"
                          ? "text-danger"
                          : "text-ink-faint"
                    }`}
                  >
                    {d.status}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
