import { defineField, defineType } from "sanity";

/**
 * Project — EDITORIAL fields only. Funding goal, amount raised, and status live
 * in Postgres (see architecture doc §4/§6), joined to this doc by `slug`.
 * Never add a money field here: totals are computed from the donations ledger,
 * not typed by an editor.
 */
export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      description: "Shared join key with the Postgres project row. Keep stable.",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "location",
      title: "Location (display copy)",
      type: "string",
      description: 'e.g. "Kakuma, Kenya". Coordinates for the map live in Postgres.',
    }),
    defineField({
      name: "heroImage",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", type: "string", title: "Alt text" }],
        },
      ],
    }),
    defineField({
      name: "summary",
      title: "Short description",
      type: "text",
      rows: 3,
      validation: (r) => r.max(280),
    }),
    defineField({
      name: "body",
      title: "Full description",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "video",
      title: "Video (optional)",
      type: "url",
      description: "Mux/hosted URL. Not required.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "location", media: "heroImage" },
  },
});
