import { z } from "zod";

/**
 * Donation validation — SHARED by client (instant feedback) and server (the
 * real gate, Day 14). Amounts are in FILS (AED minor unit) to match Ziina:
 * 100 AED = 10000 fils. Ziina's minimum is 2 AED.
 *
 * The server re-checks every field with this schema before creating a Ziina
 * payment intent. Currency is fixed server-side; the client can never change it.
 * This is what stops a tampered request (or compromised CMS tier) from setting
 * a tiny, negative, or absurd charge.
 */
export const CURRENCY = "AED" as const;
export const MIN_AMOUNT_FILS = 200; // 2 AED (Ziina minimum)
export const MAX_AMOUNT_FILS = 5_000_000; // 50,000 AED ceiling — adjust as needed

export const DESIGNATIONS = [
  "most_needed",
  "education",
  "healthcare",
  "food",
  "water",
  "project",
] as const;
export type Designation = (typeof DESIGNATIONS)[number];

export const DESIGNATION_LABELS: Record<Designation, string> = {
  most_needed: "Where needed most",
  education: "Education",
  healthcare: "Healthcare",
  food: "Food",
  water: "Clean water",
  project: "A specific project",
};

/** Fallback preset tiers (in fils) if no Sanity donationTier docs exist. */
export const FALLBACK_TIERS_FILS = [2500, 5000, 10000, 25000]; // 25 / 50 / 100 / 250 AED

export const donationSchema = z.object({
  amountFils: z
    .number({ error: "Enter an amount" })
    .int("Amount must be a whole number")
    .min(MIN_AMOUNT_FILS, `Minimum is ${MIN_AMOUNT_FILS / 100} ${CURRENCY}`)
    .max(MAX_AMOUNT_FILS, `Maximum is ${MAX_AMOUNT_FILS / 100} ${CURRENCY}`),
  designation: z.enum(DESIGNATIONS),
  projectSlug: z.string().min(1).optional(),
});

export type DonationInput = z.infer<typeof donationSchema>;

/** AED display from fils. */
export function formatAed(fils: number): string {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: fils % 100 === 0 ? 0 : 2,
  }).format(fils / 100);
}

/** Donor details (Step 3). Same schema runs client + server. */
export const donorSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.email("Enter a valid email"),
  country: z.string().min(2, "Country is required").max(80),
  isAnonymous: z.boolean().default(false),
});
export type DonorInput = z.infer<typeof donorSchema>;

/** Full checkout payload — validated server-side before creating a payment. */
export const checkoutSchema = z.object({
  ...donationSchema.shape,
  ...donorSchema.shape,
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;
