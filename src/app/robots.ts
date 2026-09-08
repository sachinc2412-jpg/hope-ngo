import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/** robots.txt — allow public pages, keep private/app routes out of the index. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/account", "/studio", "/api", "/verify", "/donate/mock-pay"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
