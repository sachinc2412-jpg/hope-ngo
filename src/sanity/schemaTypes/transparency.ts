import { defineField, defineType } from "sanity";

/**
 * Transparency — SINGLETON. Holds the "how your money helps" allocation and the
 * transparency statement shown on the homepage + /transparency page. Editors set
 * the percentages here; the site never invents them. Reports and partners are
 * their own document types, queried alongside.
 */
export const transparency = defineType({
  name: "transparency",
  title: "Transparency",
  type: "document",
  fields: [
    defineField({
      name: "statement",
      title: "Transparency statement",
      type: "text",
      rows: 3,
      description: "Your commitment to openness. Shown on the homepage.",
    }),
    defineField({
      name: "allocations",
      title: "How money is allocated",
      type: "array",
      description:
        "e.g. Programs 82, Operations 11, Fundraising 7. Set the real figures — these render as the 'how your money helps' bars.",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label" },
            {
              name: "percent",
              type: "number",
              title: "Percent",
              validation: (r) => r.required().min(0).max(100),
            },
          ],
          preview: {
            select: { title: "label", subtitle: "percent" },
            prepare: ({ title, subtitle }) => ({
              title,
              subtitle: `${subtitle}%`,
            }),
          },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Transparency" }) },
});
