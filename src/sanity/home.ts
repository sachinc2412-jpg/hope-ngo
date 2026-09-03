import { sanityFetch } from "@/sanity/fetch";
import {
  homepageQuery,
  impactStatsQuery,
  donationTiersQuery,
  featuredProjectsQuery,
  featuredStoriesQuery,
  transparencyQuery,
  partnersQuery,
} from "@/sanity/queries";
import type {
  HomepageData,
  ImpactStatData,
  DonationTierData,
  ProjectCardData,
  StoryCardData,
  TransparencyData,
  PartnerData,
} from "@/sanity/types";

/**
 * Homepage data loaders. Every loader is resilient: a Sanity outage or an empty
 * Studio returns null/[] and the sections fall back to sensible placeholder copy,
 * so the page never 500s and never renders blank.
 */
export async function getHomepage(): Promise<HomepageData | null> {
  try {
    return await sanityFetch<HomepageData | null>({
      query: homepageQuery,
      tags: ["homepage", "story"],
    });
  } catch (err) {
    console.error("Failed to load homepage:", err);
    return null;
  }
}

export async function getImpactStats(): Promise<ImpactStatData[]> {
  try {
    return await sanityFetch<ImpactStatData[]>({
      query: impactStatsQuery,
      tags: ["impactStat"],
    });
  } catch (err) {
    console.error("Failed to load impact stats:", err);
    return [];
  }
}

export async function getDonationTiers(): Promise<DonationTierData[]> {
  try {
    return await sanityFetch<DonationTierData[]>({
      query: donationTiersQuery,
      tags: ["donationTier"],
    });
  } catch (err) {
    console.error("Failed to load donation tiers:", err);
    return [];
  }
}

export async function getFeaturedProjects(): Promise<ProjectCardData[]> {
  try {
    return await sanityFetch<ProjectCardData[]>({
      query: featuredProjectsQuery,
      tags: ["project"],
    });
  } catch (err) {
    console.error("Failed to load featured projects:", err);
    return [];
  }
}

export async function getFeaturedStories(): Promise<StoryCardData[]> {
  try {
    return await sanityFetch<StoryCardData[]>({
      query: featuredStoriesQuery,
      tags: ["story"],
    });
  } catch (err) {
    console.error("Failed to load featured stories:", err);
    return [];
  }
}

export async function getTransparency(): Promise<TransparencyData | null> {
  try {
    return await sanityFetch<TransparencyData | null>({
      query: transparencyQuery,
      tags: ["transparency"],
    });
  } catch (err) {
    console.error("Failed to load transparency:", err);
    return null;
  }
}

export async function getPartners(): Promise<PartnerData[]> {
  try {
    return await sanityFetch<PartnerData[]>({
      query: partnersQuery,
      tags: ["partner"],
    });
  } catch (err) {
    console.error("Failed to load partners:", err);
    return [];
  }
}
