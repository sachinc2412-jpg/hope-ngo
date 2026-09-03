import { defineField, defineType } from "sanity";

/**
 * Donation tier — COPY + a suggested amount. The amount here is a convenience
 * for editors; the server ALWAYS re-validates the charged amount against an
 * allow-list before touching Stripe. A compromised CMS must not be able to set
 * a $0.01 or negative charge (architecture doc §5).
 */
export const donationTier = defineType({
  name: "donationTier",
  title: "Donation tier",
  type: "document",
  fields: [
    defineField({
      name: "label",
      type: "string",
      description: 'e.g. "$50"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "amountCents",
      title: "Amount (in cents)",
      type: "number",
      description: "5000 = $50. Re-validated server-side.",
      validation: (r) => r.required().integer().positive(),
    }),
    defineField({
      name: "impactCopy",
      title: "Impact statement",
      type: "string",
      description:
        'e.g. "provides essential supplies". Keep factual, no invented claims.',
    }),
    defineField({
      name: "order",
      type: "number",
      validation: (r) => r.required(),
    }),
  ],
  orderings: [
    { title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "label", subtitle: "impactCopy" } },
});
