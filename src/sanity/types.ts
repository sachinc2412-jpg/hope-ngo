import type { PortableTextBlock } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";

/** Hand-typed for now. Can switch to `sanity typegen` later for generated types. */
export type SanityImage = SanityImageSource & { alt?: string };

export interface ProjectCardData {
  _id: string;
  title: string;
  slug: string;
  location?: string;
  summary?: string;
  heroImage: SanityImage;
}

export interface ProjectDetail extends ProjectCardData {
  gallery?: SanityImage[];
  body?: PortableTextBlock[];
  video?: string;
}

export interface FeaturedStory {
  title: string;
  personName?: string;
  slug: string;
  heroImage: SanityImage;
  excerpt?: string;
}

export interface HomepageData {
  heroHeadline?: string;
  heroSubtext?: string;
  heroMedia?: SanityImage;
  finalCtaHeadline?: string;
  finalCtaText?: string;
  featuredStory?: FeaturedStory;
}

export interface ImpactStatData {
  _id: string;
  label: string;
  value: number;
  suffix?: string;
}

export interface DonationTierData {
  _id: string;
  label: string;
  amountCents: number;
  impactCopy?: string;
}

export interface StoryCardData {
  _id: string;
  title: string;
  personName?: string;
  slug: string;
  heroImage: SanityImage;
  excerpt?: string;
}

export interface Allocation {
  label: string;
  percent: number;
}

export interface TransparencyData {
  statement?: string;
  allocations?: Allocation[];
}

export interface PartnerData {
  _id: string;
  name: string;
  logo?: SanityImage;
  url?: string;
}

export interface ImpactUpdateData {
  _id: string;
  title: string;
  publishedAt?: string;
  image?: SanityImage;
  projectTitle?: string;
  projectSlug?: string;
}

export interface StoryDetail {
  title: string;
  personName?: string;
  heroImage: SanityImage;
  excerpt?: string;
  body?: import("@portabletext/react").PortableTextBlock[];
  publishedAt?: string;
  relatedProject?: { title: string; slug: string };
}

export interface TransparencyReport {
  _id: string;
  year: number;
  type: "annual" | "audit";
  summary?: string;
  fileUrl?: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  photo?: SanityImage;
  bio?: string;
}
