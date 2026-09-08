import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/donation/ShareButton";
import {
  formatAed,
  DESIGNATION_LABELS,
  type Designation,
} from "@/lib/validation/donation";
import { IMPACT_STATEMENTS } from "@/lib/donations/impact";

export const metadata = { title: "Thank you — Hope" };

/**
 * Success experience. Reads SERVER-CONFIRMED state by reference (the reference
 * acts as a capability token). If the webhook hasn't landed yet, shows a
 * processing note. Never asserts success from a client callback.
 */
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  let donation: {
    amount_cents: number;
    designation: string;
    status: string;
    reference: string;
    donors: { email: string | null } | { email: string | null }[] | null;
  } | null = null;

  if (ref) {
    const admin = createAdminClient();
    const { data } = await admin
      .from("donations")
      .select("amount_cents, designation, status, reference, donors(email)")
      .eq("reference", ref)
      .maybeSingle();
    donation = data;
  }

  if (!donation) {
    return (
      <section className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="text-ink font-display text-3xl">
          We couldn&rsquo;t find that donation
        </h1>
        <p className="text-ink-soft mt-3 font-sans">
          Check the link, or head back and try again.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Back home</Link>
        </Button>
      </section>
    );
  }

  const confirmed = donation.status === "succeeded";
  const designation = donation.designation as Designation;
  const donorRow = Array.isArray(donation.donors) ? donation.donors[0] : donation.donors;
  const email = donorRow?.email ?? undefined;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://hope.org";

  if (!confirmed) {
    return (
      <section className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="text-ink font-display text-4xl tracking-tight">Almost there…</h1>
        <p className="text-ink-soft mt-6 font-sans">
          Your payment is being confirmed. This page updates within a few seconds —
          refresh if it doesn&rsquo;t.
        </p>
        <p className="text-ink-faint mt-2 font-sans text-sm">
          Reference {donation.reference}
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-xl px-6 py-20 text-center md:py-28">
      <p className="text-ink-faint font-sans text-sm tracking-wide uppercase">
        Donation confirmed
      </p>
      <h1 className="text-ink font-display mt-4 text-4xl leading-tight tracking-tight md:text-5xl">
        Thank you. You just became part of the story.
      </h1>
      <p className="text-ink-soft mx-auto mt-5 max-w-md font-sans text-lg leading-relaxed">
        {IMPACT_STATEMENTS[designation] ?? IMPACT_STATEMENTS.most_needed}
      </p>

      <div className="border-line bg-bg-raised mx-auto mt-10 max-w-sm rounded-lg border p-6 text-left">
        <Row label="Amount" value={formatAed(donation.amount_cents)} />
        <Row
          label="Cause"
          value={DESIGNATION_LABELS[designation] ?? donation.designation}
        />
        <Row label="Reference" value={donation.reference} />
      </div>

      {email && (
        <p className="text-ink-faint mt-6 font-sans text-sm">
          A receipt is on its way to {email}.
        </p>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
        <ShareButton
          url={site}
          text="I just supported Hope. Join me in creating access to opportunity and dignity."
        />
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-line flex justify-between gap-4 border-b py-2 last:border-0">
      <span className="text-ink-faint font-sans text-sm">{label}</span>
      <span className="text-ink font-sans text-sm font-medium">{value}</span>
    </div>
  );
}
