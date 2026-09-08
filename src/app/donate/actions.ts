"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getPaymentProvider } from "@/lib/payments";
import { checkoutSchema, CURRENCY, type CheckoutInput } from "@/lib/validation/donation";
import { generateReference } from "@/lib/donations/reference";

type ActionResult = { redirectUrl: string } | { error: string };

/**
 * Create a donation and start payment. THE SERVER GATE:
 *  1. Re-validate the full checkout with the shared schema (never trust client).
 *  2. Resolve/create the donor (linked to the auth user if signed in).
 *  3. Resolve project_id from slug when giving to a specific project.
 *  4. Insert a PENDING donation via the admin client (donations are
 *     server-write-only by RLS — clients cannot insert).
 *  5. Create a payment intent through the provider seam (mock today, Ziina last).
 *  6. Store the provider payment-intent id, return its hosted redirect URL.
 * The donation is only marked 'succeeded' later, by the verified webhook (Day 15).
 */
export async function createDonationAction(input: CheckoutInput): Promise<ActionResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid donation" };
  }
  const data = parsed.data;

  const admin = createAdminClient();

  // Who is giving? Link to the auth user if there is a session; else guest.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Resolve or create donor.
  let donorId: string;
  if (user) {
    const { data: existing } = await admin
      .from("donors")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (existing) {
      donorId = existing.id;
    } else {
      const { data: created, error } = await admin
        .from("donors")
        .insert({
          user_id: user.id,
          email: data.email,
          display_name: data.name,
          country: data.country,
          is_anonymous: data.isAnonymous,
        })
        .select("id")
        .single();
      if (error || !created) return { error: "Could not create donor record" };
      donorId = created.id;
    }
  } else {
    const { data: created, error } = await admin
      .from("donors")
      .insert({
        email: data.email,
        display_name: data.name,
        country: data.country,
        is_anonymous: data.isAnonymous,
      })
      .select("id")
      .single();
    if (error || !created) return { error: "Could not create donor record" };
    donorId = created.id;
  }

  // Resolve project when giving to a specific project.
  let projectId: string | null = null;
  if (data.designation === "project" && data.projectSlug) {
    const { data: project } = await admin
      .from("projects")
      .select("id")
      .eq("slug", data.projectSlug)
      .maybeSingle();
    projectId = project?.id ?? null;
  }

  const reference = generateReference();

  // Insert the PENDING donation.
  const { data: donation, error: donationError } = await admin
    .from("donations")
    .insert({
      donor_id: donorId,
      project_id: projectId,
      amount_cents: data.amountFils, // fils = AED minor unit
      currency: CURRENCY,
      designation: data.designation,
      type: "one_time",
      status: "pending",
      reference,
      is_anonymous: data.isAnonymous,
    })
    .select("id, reference")
    .single();
  if (donationError || !donation) {
    return { error: "Could not create donation" };
  }

  // Create the payment intent through the provider seam.
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const provider = getPaymentProvider();
  let intent;
  try {
    intent = await provider.createPaymentIntent({
      amountFils: data.amountFils,
      currency: CURRENCY,
      reference,
      successUrl: `${site}/donate/success?ref=${reference}`,
      cancelUrl: `${site}/donate?canceled=1`,
      metadata: { donationId: donation.id, reference },
    });
  } catch {
    return { error: "Could not start payment. Please try again." };
  }

  // Store provider id on the donation.
  await admin
    .from("donations")
    .update({ provider_payment_intent_id: intent.id })
    .eq("id", donation.id);

  return { redirectUrl: intent.redirectUrl };
}
