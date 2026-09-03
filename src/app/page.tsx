import { Hero } from "@/components/home/Hero";
import { HumanStory } from "@/components/home/HumanStory";
import { ImpactStats } from "@/components/home/ImpactStats";
import { DonationImpact } from "@/components/home/DonationImpact";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { ImpactMapPreview } from "@/components/home/ImpactMapPreview";
import { StoriesOfChange } from "@/components/home/StoriesOfChange";
import { Transparency } from "@/components/home/Transparency";
import { HowMoneyHelps } from "@/components/home/HowMoneyHelps";
import { GetInvolved } from "@/components/home/GetInvolved";
import { FinalCTA } from "@/components/home/FinalCTA";
import {
  getHomepage,
  getImpactStats,
  getDonationTiers,
  getFeaturedProjects,
  getFeaturedStories,
  getTransparency,
  getPartners,
} from "@/sanity/home";

/**
 * Homepage — the full 13-section scroll (Days 5–7). Everything Sanity-driven
 * with fallbacks; sections omit themselves when their content is empty. Footer
 * is in the layout. No motion yet — Days 32–34.
 */
export default async function Home() {
  const [homepage, stats, tiers, projects, stories, transparency, partners] =
    await Promise.all([
      getHomepage(),
      getImpactStats(),
      getDonationTiers(),
      getFeaturedProjects(),
      getFeaturedStories(),
      getTransparency(),
      getPartners(),
    ]);

  return (
    <>
      <Hero data={homepage} />
      <HumanStory story={homepage?.featuredStory} />
      <ImpactStats stats={stats} />
      <DonationImpact tiers={tiers} />
      <FeaturedProjects projects={projects} />
      <ImpactMapPreview />
      <StoriesOfChange stories={stories} />
      <Transparency data={transparency} partners={partners} />
      <HowMoneyHelps allocations={transparency?.allocations} />
      <GetInvolved />
      <FinalCTA headline={homepage?.finalCtaHeadline} text={homepage?.finalCtaText} />
    </>
  );
}
