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
import { Reveal } from "@/components/motion/Reveal";
import {
  getHomepage,
  getImpactStats,
  getDonationTiers,
  getFeaturedProjects,
  getFeaturedStories,
  getTransparency,
  getPartners,
} from "@/sanity/home";
import { getFundingBySlugs } from "@/lib/donations/funding";

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
  const funding = await getFundingBySlugs(projects.map((p) => p.slug));

  return (
    <>
      <Hero data={homepage} />
      <Reveal>
        <HumanStory story={homepage?.featuredStory} />
      </Reveal>
      <Reveal>
        <ImpactStats stats={stats} />
      </Reveal>
      <Reveal>
        <DonationImpact tiers={tiers} />
      </Reveal>
      <Reveal>
        <FeaturedProjects projects={projects} funding={funding} />
      </Reveal>
      <Reveal>
        <ImpactMapPreview />
      </Reveal>
      <Reveal>
        <StoriesOfChange stories={stories} />
      </Reveal>
      <Reveal>
        <Transparency data={transparency} partners={partners} />
      </Reveal>
      <Reveal>
        <HowMoneyHelps allocations={transparency?.allocations} />
      </Reveal>
      <Reveal>
        <GetInvolved />
      </Reveal>
      <Reveal>
        <FinalCTA headline={homepage?.finalCtaHeadline} text={homepage?.finalCtaText} />
      </Reveal>
    </>
  );
}
