export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://hope-ngo-eight.vercel.app";

export const siteName = "Hope";
export const siteDescription =
  "Every contribution helps create access to opportunity, dignity and a better future for communities that need it most.";

/** Organization structured data (site-wide). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: siteName,
    url: siteUrl,
    description: siteDescription,
  };
}

/** BreadcrumbList for a detail page. items: [{name, path}] in order. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${siteUrl}${it.path}`,
    })),
  };
}

/** Article structured data for stories/projects. */
export function articleJsonLd(a: {
  title: string;
  description?: string;
  image?: string;
  path: string;
  publishedAt?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    image: a.image ? [a.image] : undefined,
    datePublished: a.publishedAt,
    mainEntityOfPage: `${siteUrl}${a.path}`,
    publisher: { "@type": "NGO", name: siteName, url: siteUrl },
  };
}
