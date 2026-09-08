import { getDonationTiers } from "@/sanity/home";
import { sanityFetch } from "@/sanity/fetch";
import { groq } from "next-sanity";
import { DonationFlow } from "@/components/donation/DonationFlow";
import {
  FALLBACK_TIERS_FILS,
  formatAed,
  DESIGNATIONS,
  type Designation,
} from "@/lib/validation/donation";

export const metadata = {
  title: "Donate — Hope",
  description: "Make a one-time gift that goes to work immediately.",
};

/** Resolve a project slug -> title for the "Supporting: X" line. */
async function getProjectName(slug: string): Promise<string | undefined> {
  try {
    const res = await sanityFetch<{ title: string } | null>({
      query: groq`*[_type == "project" && slug.current == $slug][0]{ title }`,
      params: { slug },
      tags: ["project"],
    });
    return res?.title;
  } catch {
    return undefined;
  }
}

export default async function DonatePage({
  searchParams,
}: {
  searchParams: Promise<{
    amount?: string;
    project?: string;
    designation?: string;
    canceled?: string;
    failed?: string;
  }>;
}) {
  const sp = await searchParams;
  const notice =
    sp.canceled === "1"
      ? "Payment canceled — you weren't charged."
      : sp.failed === "1"
        ? "That payment didn't go through. Please try again."
        : null;

  // Tiers from Sanity (amountCents treated as fils), fallback if none.
  const sanityTiers = await getDonationTiers();
  const tiers =
    sanityTiers.length > 0
      ? sanityTiers.map((t) => ({ label: t.label, amountFils: t.amountCents }))
      : FALLBACK_TIERS_FILS.map((f) => ({ label: formatAed(f), amountFils: f }));

  // Deep-link preselects from homepage tiers / project pages.
  const initialAmountFils = sp.amount ? parseInt(sp.amount, 10) || undefined : undefined;
  const projectSlug = sp.project;
  const projectName = projectSlug ? await getProjectName(projectSlug) : undefined;
  const initialDesignation = DESIGNATIONS.includes(sp.designation as Designation)
    ? (sp.designation as Designation)
    : undefined;

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <div className="mb-10 text-center">
        <h1 className="font-display text-ink text-4xl tracking-tight md:text-5xl">
          Make your gift
        </h1>
        <p className="text-ink-soft mx-auto mt-3 max-w-md font-sans">
          A one-time donation, working immediately. No account needed.
        </p>
      </div>
      {notice && (
        <p className="border-danger/30 bg-danger/5 text-danger mx-auto mb-8 max-w-xl rounded-sm border px-4 py-3 text-center font-sans text-sm">
          {notice}
        </p>
      )}
      <DonationFlow
        tiers={tiers}
        initialAmountFils={initialAmountFils}
        initialDesignation={initialDesignation}
        projectSlug={projectSlug}
        projectName={projectName}
      />
    </section>
  );
}
