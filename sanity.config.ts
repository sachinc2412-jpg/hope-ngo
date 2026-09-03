"use client";

/**
 * Sanity Studio config. Mounted at /studio inside the Next app. The singleton
 * plugin below hides "create"/"delete" for the homepage so it stays a single doc.
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { schema, singletonTypes } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  document: {
    // Hide singleton types from the global "create new" menu.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter((t) => !singletonTypes.has(t.templateId))
        : prev,
    // Remove delete/duplicate actions on singletons.
    actions: (prev, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? prev.filter(
            (a) => a.action && !["unpublish", "delete", "duplicate"].includes(a.action)
          )
        : prev,
  },
});
