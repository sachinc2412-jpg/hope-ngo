import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/account/StatCard";
import { AccountNav } from "@/components/account/AccountNav";
import { getProjectTitles } from "@/lib/donations/titles";
import { getImpactUpdatesForSlugs } from "@/lib/donations/updates";
import { ImpactUpdates } from "@/components/account/ImpactUpdates";
import {
  formatAed,
  DESIGNATION_LABELS,
  type Designation,
} from "@/lib/validation/donation";

export const metadata = { title: "Your account — Hope" };

type DonationRow = {
  id: string;
  amount_cents: number;
  designation: string;
  status: string;
  reference: string;
  created_at: string;
  project_id: string | null;
  projects: { slug: string } | { slug: string }[] | null;
};

const STATUS_LABEL: Record<string, string> = {
  succeeded: "Confirmed",
  pending: "Processing",
  failed: "Failed",
  refunded: "Refunded",
};

/**
 * Donor dashboard. Reads the signed-in user's own donations via their session —
 * RLS returns only their rows. Metrics count only succeeded gifts. Deliberately
 * NO "people impacted" figure: we don't have real per-donor attribution, so we
 * won't invent one.
 */
export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?redirect=/account");

  const { data } = await supabase
    .from("donations")
    .select(
      "id, amount_cents, designation, status, reference, created_at, project_id, projects(slug)"
    )
    .order("created_at", { ascending: false });
  const donations = (data ?? []) as DonationRow[];

  const succeeded = donations.filter((d) => d.status === "succeeded");
  const totalCents = succeeded.reduce((sum, d) => sum + d.amount_cents, 0);
  const projectIds = new Set(
    succeeded.filter((d) => d.project_id).map((d) => d.project_id)
  );

  const slugOf = (d: DonationRow) => {
    const p = Array.isArray(d.projects) ? d.projects[0] : d.projects;
    return p?.slug;
  };
  const titles = await getProjectTitles(
    donations.map(slugOf).filter((s): s is string => Boolean(s))
  );

  const supportedSlugs = succeeded.map(slugOf).filter((s): s is string => Boolean(s));
  const updates = await getImpactUpdatesForSlugs(supportedSlugs);

  return (
    <section className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      <h1 className="text-ink font-display text-4xl tracking-tight">Your impact</h1>
      <p className="text-ink-soft mt-1 font-sans text-sm">Signed in as {user.email}</p>
      <AccountNav />

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total donated" value={formatAed(totalCents)} />
        <StatCard label="Projects supported" value={String(projectIds.size)} />
        <StatCard label="Donations made" value={String(succeeded.length)} />
      </div>

      <h2 className="text-ink font-display mt-14 text-2xl">Donation history</h2>

      {donations.length === 0 ? (
        <div className="border-line mt-6 rounded-lg border border-dashed p-10 text-center">
          <p className="text-ink-soft font-sans">
            You haven&rsquo;t made a donation yet.
          </p>
          <Button asChild className="mt-6">
            <Link href="/donate">Make your first gift</Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {donations.map((d) => {
            const slug = slugOf(d);
            const cause = slug
              ? (titles.get(slug) ?? "A project")
              : (DESIGNATION_LABELS[d.designation as Designation] ?? d.designation);
            return (
              <li
                key={d.id}
                className="border-line bg-bg-raised flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
              >
                <div>
                  <p className="text-ink font-sans font-medium">{cause}</p>
                  <p className="text-ink-faint font-sans text-xs">
                    {new Date(d.created_at).toLocaleDateString("en-AE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    &middot; {d.reference}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-ink font-display text-lg">
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
                    {STATUS_LABEL[d.status] ?? d.status}
                  </p>
                  {d.status === "succeeded" && (
                    <Link
                      href={`/account/receipt/${d.reference}`}
                      className="text-accent mt-1 inline-block font-sans text-xs underline underline-offset-2"
                    >
                      Receipt
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <ImpactUpdates updates={updates} />
    </section>
  );
}
