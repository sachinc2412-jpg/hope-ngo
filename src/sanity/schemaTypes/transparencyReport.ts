import { defineField, defineType } from "sanity";

/** Transparency report — annual reports + audited statements as downloadable files. */
export const transparencyReport = defineType({
  name: "transparencyReport",
  title: "Transparency report",
  type: "document",
  fields: [
    defineField({
      name: "year",
      type: "number",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "type",
      type: "string",
      options: {
        list: [
          { title: "Annual report", value: "annual" },
          { title: "Audited financial statement", value: "audit" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "summary", type: "text", rows: 2 }),
    defineField({
      name: "file",
      type: "file",
      validation: (r) => r.required(),
    }),
  ],
  orderings: [
    { title: "Year", name: "year", by: [{ field: "year", direction: "desc" }] },
  ],
  preview: { select: { title: "year", subtitle: "type" } },
});
