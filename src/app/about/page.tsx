import { sanityFetch } from "@/sanity/fetch";
import { teamQuery } from "@/sanity/queries";
import { SanityImage } from "@/components/sanity/SanityImage";
import type { TeamMember } from "@/sanity/types";

export const metadata = {
  title: "About — Hope",
  description: "Our mission and the people behind it.",
};

async function getTeam(): Promise<TeamMember[]> {
  try {
    return await sanityFetch<TeamMember[]>({ query: teamQuery, tags: ["teamMember"] });
  } catch {
    return [];
  }
}

export default async function AboutPage() {
  const team = await getTeam();
  return (
    <div>
      <section className="mx-auto max-w-[var(--container-content)] px-6 py-20 md:py-28">
        <p className="text-ink-faint font-sans text-sm tracking-wide uppercase">About</p>
        <h1 className="text-ink font-display mt-3 max-w-3xl text-4xl leading-tight tracking-tight md:text-6xl">
          Creating access to opportunity, dignity and a better future.
        </h1>
        <p className="text-ink-soft mt-6 max-w-2xl font-sans text-lg leading-relaxed">
          Placeholder mission statement — replace with the organization&rsquo;s real story
          and mission. This copy is structured so it can be moved to the CMS later.
        </p>
      </section>

      {team.length > 0 && (
        <section className="border-line border-t">
          <div className="mx-auto max-w-[var(--container-content)] px-6 py-16 md:py-20">
            <h2 className="text-ink font-display text-3xl">The team</h2>
            <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((m) => (
                <div key={m._id}>
                  {m.photo && (
                    <div className="bg-line relative aspect-square w-24 overflow-hidden rounded-full">
                      <SanityImage
                        image={m.photo}
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <p className="text-ink font-display mt-4 text-xl">{m.name}</p>
                  <p className="text-ink-faint font-sans text-sm">{m.role}</p>
                  {m.bio && (
                    <p className="text-ink-soft mt-2 font-sans text-sm leading-relaxed">
                      {m.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
