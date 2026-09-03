import { defineField, defineType } from "sanity";

/** Campaign — editorial. Financial goal/progress live in Postgres, joined by slug. */
export const campaign = defineType({
  name: "campaign",
  title: "Campaign",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "summary", type: "text", rows: 3 }),
    defineField({
      name: "heroImage",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({
      name: "body",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
  ],
  preview: { select: { title: "title", media: "heroImage" } },
});
