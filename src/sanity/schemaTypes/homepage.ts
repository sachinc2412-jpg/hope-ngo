import { defineField, defineType } from "sanity";

/**
 * Homepage — SINGLETON. Editors edit the one instance; the desk structure
 * prevents creating more (see structure in sanity.config.ts). Holds hero copy
 * + which human story to feature. Section ordering handled in code for now.
 */
export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "heroSubtext", type: "text", rows: 2 }),
    defineField({
      name: "heroMedia",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({
      name: "finalCtaHeadline",
      title: "Final CTA headline",
      type: "string",
      description: 'e.g. "Your next decision could change someone\'s tomorrow."',
    }),
    defineField({
      name: "finalCtaText",
      title: "Final CTA subtext",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "featuredStory",
      type: "reference",
      to: [{ type: "story" }],
      description: "The human story surfaced in the Meet-X section.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage" }),
  },
});
