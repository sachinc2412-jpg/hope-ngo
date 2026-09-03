import { defineField, defineType } from "sanity";

/** Article — blog / news. */
export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heroImage",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({ name: "excerpt", type: "text", rows: 2 }),
    defineField({
      name: "body",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "author",
      type: "reference",
      to: [{ type: "teamMember" }],
    }),
    defineField({ name: "publishedAt", type: "datetime" }),
  ],
  preview: { select: { title: "title", media: "heroImage" } },
});
