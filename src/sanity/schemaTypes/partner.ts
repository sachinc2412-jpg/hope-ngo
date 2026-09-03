import { defineField, defineType } from "sanity";

/** Partner — logo + link for the transparency/partners strip. */
export const partner = defineType({
  name: "partner",
  title: "Partner",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "logo",
      type: "image",
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({ name: "url", type: "url" }),
    defineField({ name: "order", type: "number" }),
  ],
  preview: { select: { title: "name", media: "logo" } },
});
