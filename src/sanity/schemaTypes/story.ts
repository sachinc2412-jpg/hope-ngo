import { defineField, defineType } from "sanity";

/** Story of change — long-form editorial about one person/community. */
export const story = defineType({
  name: "story",
  title: "Story",
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
      name: "personName",
      title: "Person / community name",
      type: "string",
    }),
    defineField({
      name: "heroImage",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "excerpt",
      type: "text",
      rows: 2,
      validation: (r) => r.max(240),
    }),
    defineField({
      name: "body",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "relatedProject",
      type: "reference",
      to: [{ type: "project" }],
    }),
    defineField({ name: "publishedAt", type: "datetime" }),
  ],
  preview: { select: { title: "title", subtitle: "personName", media: "heroImage" } },
});
