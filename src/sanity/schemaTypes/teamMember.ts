import { defineField, defineType } from "sanity";

/** Team member — governance / about page. */
export const teamMember = defineType({
  name: "teamMember",
  title: "Team member",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "photo",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({ name: "bio", type: "text", rows: 3 }),
    defineField({ name: "order", type: "number" }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});
