import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { PrintButton } from "@/components/account/PrintButton";
import {
  formatAed,
  DESIGNATION_LABELS,
  type Designation,
} from "@/lib/validation/donation";

export const metadata = { title: "Receipt — Hope" };

/**
 * Printable donation receipt. Read via the user's session — RLS guarantees a
 * donor can only open their OWN receipt. A succeeded donation only.
 */
export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/sign-in?redirect=/account/receipt/${reference}`);

  const { data: d } = await supabase
    .from("donations")
    .select(
      "amount_cents, designation, status, reference, created_at, donors(display_name)"
    )
    .eq("reference", reference)
    .maybeSingle();

  if (!d || d.status !== "succeeded") notFound();

  const donor = Array.isArray(d.donors) ? d.donors[0] : d.donors;
  const cause = DESIGNATION_LABELS[d.designation as Designation] ?? d.designation;

  return (
    <section className="mx-auto max-w-lg px-6 py-16">
      <div className="no-print mb-6 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href="/account">&larr; Back</Link>
        </Button>
        <PrintButton />
      </div>

      <div className="border-line bg-bg-raised rounded-lg border p-8">
        <p className="text-ink font-display text-2xl">Hope</p>
        <p className="text-ink-faint mt-1 font-sans text-sm">Donation receipt</p>

        <div className="border-line mt-8 border-t pt-6">
          <Line label="Received from" value={donor?.display_name ?? "Friend"} />
          <Line label="Amount" value={formatAed(d.amount_cents)} />
          <Line label="Cause" value={cause} />
          <Line label="Reference" value={d.reference} />
          <Line
            label="Date"
            value={new Date(d.created_at).toLocaleDateString("en-AE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />
        </div>

        <p className="text-ink-faint mt-8 font-sans text-xs leading-relaxed">
          Hope — placeholder registration details. This receipt is issued for the amount
          shown above. Thank you for your generosity.
        </p>
      </div>
    </section>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-line flex justify-between gap-4 border-b py-3 last:border-0">
      <span className="text-ink-faint font-sans text-sm">{label}</span>
      <span className="text-ink font-sans text-sm font-medium">{value}</span>
    </div>
  );
}
