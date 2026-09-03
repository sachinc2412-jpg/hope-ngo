import { defineField, defineType } from "sanity";

/** Project update — impact posts tied to a project (donor dashboard + project page). */
export const projectUpdate = defineType({
  name: "projectUpdate",
  title: "Project update",
  type: "document",
  fields: [
    defineField({
      name: "relatedProject",
      type: "reference",
      to: [{ type: "project" }],
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "body",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({ name: "publishedAt", type: "datetime" }),
  ],
  preview: {
    select: { title: "title", subtitle: "relatedProject.title", media: "image" },
  },
});
