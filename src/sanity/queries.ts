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

export const adminStoriesQuery = groq`
  *[_type == "story"] | order(coalesce(publishedAt, _createdAt) desc) {
    _id,
    title,
    personName,
    "slug": slug.current,
    "project": relatedProject->title,
    publishedAt
  }
`;

export const adminUpdatesQuery = groq`
  *[_type == "projectUpdate"] | order(coalesce(publishedAt, _createdAt) desc) {
    _id,
    title,
    "project": relatedProject->title,
    "projectSlug": relatedProject->slug.current,
    publishedAt
  }
`;

export const allStoriesQuery = groq`
  *[_type == "story"] | order(coalesce(publishedAt, _createdAt) desc) {
    _id, title, personName, "slug": slug.current, heroImage, excerpt
  }
`;

export const storySlugsQuery = groq`
  *[_type == "story" && defined(slug.current)][].slug.current
`;

export const storyBySlugQuery = groq`
  *[_type == "story" && slug.current == $slug][0] {
    title, personName, heroImage, excerpt, body, publishedAt,
    "relatedProject": relatedProject->{ title, "slug": slug.current }
  }
`;

export const transparencyReportsQuery = groq`
  *[_type == "transparencyReport"] | order(year desc) {
    _id, year, type, summary, "fileUrl": file.asset->url
  }
`;

export const teamQuery = groq`
  *[_type == "teamMember"] | order(order asc) {
    _id, name, role, photo, bio
  }
`;

export const mapProjectsQuery = groq`
  *[_type == "project" && defined(slug.current)]{
    "slug": slug.current, title, location
  }
`;
