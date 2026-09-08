import { groq } from "next-sanity";

/**
 * GROQ queries. Projects here return EDITORIAL fields only — funding data
 * (goal/raised/status) comes from Postgres and is merged in later (Day 9+),
 * joined on `slug`.
 */

export const allProjectsQuery = groq`
  *[_type == "project"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    location,
    summary,
    heroImage
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    location,
    summary,
    heroImage,
    gallery,
    body,
    video
  }
`;

export const projectSlugsQuery = groq`
  *[_type == "project" && defined(slug.current)][].slug.current
`;

export const homepageQuery = groq`
  *[_type == "homepage"][0] {
    heroHeadline,
    heroSubtext,
    heroMedia,
    finalCtaHeadline,
    finalCtaText,
    featuredStory->{
      title,
      personName,
      "slug": slug.current,
      heroImage,
      excerpt
    }
  }
`;

export const impactStatsQuery = groq`
  *[_type == "impactStat"] | order(order asc) {
    _id,
    label,
    value,
    suffix
  }
`;

export const donationTiersQuery = groq`
  *[_type == "donationTier"] | order(order asc) {
    _id,
    label,
    amountCents,
    impactCopy
  }
`;

export const featuredProjectsQuery = groq`
  *[_type == "project"] | order(_createdAt desc)[0...3] {
    _id,
    title,
    "slug": slug.current,
    location,
    summary,
    heroImage
  }
`;

export const featuredStoriesQuery = groq`
  *[_type == "story"] | order(coalesce(publishedAt, _createdAt) desc)[0...3] {
    _id,
    title,
    personName,
    "slug": slug.current,
    heroImage,
    excerpt
  }
`;

export const homepageCtaFragment = groq`finalCtaHeadline, finalCtaText`;

export const transparencyQuery = groq`
  *[_type == "transparency"][0] {
    statement,
    allocations[] { label, percent }
  }
`;

export const partnersQuery = groq`
  *[_type == "partner"] | order(order asc) {
    _id,
    name,
    logo,
    url
  }
`;

export const impactUpdatesForSlugsQuery = groq`
  *[_type == "projectUpdate" && relatedProject->slug.current in $slugs]
    | order(coalesce(publishedAt, _createdAt) desc)[0...12] {
    _id,
    title,
    publishedAt,
    image,
    "projectTitle": relatedProject->title,
    "projectSlug": relatedProject->slug.current
  }
`;
