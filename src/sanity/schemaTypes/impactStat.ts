import { defineField, defineType } from "sanity";

/** Impact statistic — the 18,492 / 47 / 23 / 12 headline block. Editor-set. */
export const impactStat = defineType({
  name: "impactStat",
  title: "Impact statistic",
  type: "document",
  fields: [
    defineField({
      name: "label",
      type: "string",
      description: 'e.g. "People supported"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "value",
      type: "number",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "suffix",
      type: "string",
      description: 'Optional, e.g. "+" or "k". Purely display.',
    }),
    defineField({ name: "order", type: "number", validation: (r) => r.required() }),
  ],
  orderings: [
    { title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "value", subtitle: "label" } },
});
