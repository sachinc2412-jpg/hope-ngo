import Image from "next/image";
import { sanityFetch } from "@/sanity/fetch";
import {
  transparencyQuery,
  transparencyReportsQuery,
  partnersQuery,
  teamQuery,
} from "@/sanity/queries";
import { HowMoneyHelps } from "@/components/home/HowMoneyHelps";
import { SanityImage } from "@/components/sanity/SanityImage";
import { urlFor } from "@/sanity/image";
import type {
  TransparencyData,
  TransparencyReport,
  PartnerData,
  TeamMember,
} from "@/sanity/types";

export const metadata = {
  title: "Transparency — Hope",
  description: "Where your money goes. Our financials, reports and governance.",
};

const FALLBACK_STATEMENT =
  "We believe trust is earned through openness. Our financials, annual reports and audited statements are published in full — so you can see exactly where your gift goes.";

async function load() {
  const safe = async <T,>(p: Promise<T>, fb: T): Promise<T> => {
    try {
      return await p;
    } catch {
      return fb;
    }
  };
  const [data, reports, partners, team] = await Promise.all([
    safe(
      sanityFetch<TransparencyData | null>({
        query: transparencyQuery,
        tags: ["transparency"],
      }),
      null
    ),
    safe(
      sanityFetch<TransparencyReport[]>({
        query: transparencyReportsQuery,
        tags: ["transparencyReport"],
      }),
      []
    ),
    safe(sanityFetch<PartnerData[]>({ query: partnersQuery, tags: ["partner"] }), []),
    safe(sanityFetch<TeamMember[]>({ query: teamQuery, tags: ["teamMember"] }), []),
  ]);
  return { data, reports, partners, team };
}

export default async function TransparencyPage() {
  const { data, reports, partners, team } = await load();

  return (
    <div>
      <section className="mx-auto max-w-[var(--container-content)] px-6 py-20 md:py-28">
        <p className="text-ink-faint font-sans text-sm tracking-wide uppercase">
          Transparency
        </p>
        <h1 className="text-ink font-display mt-3 max-w-3xl text-4xl leading-tight tracking-tight md:text-6xl">
          You deserve to know where your money goes.
        </h1>
        <p className="text-ink-soft mt-6 max-w-2xl font-sans text-lg leading-relaxed">
          {data?.statement || FALLBACK_STATEMENT}
        </p>
      </section>

      <HowMoneyHelps allocations={data?.allocations} />

      {/* Reports */}
      <section className="border-line border-t">
        <div className="mx-auto max-w-[var(--container-content)] px-6 py-20 md:py-24">
          <h2 className="text-ink font-display text-3xl">Reports &amp; statements</h2>
          {reports.length === 0 ? (
            <p className="text-ink-faint mt-6 font-sans">
              Annual reports and audited statements will be published here.
            </p>
          ) : (
            <ul className="mt-8 flex flex-col gap-3">
              {reports.map((r) => (
                <li
                  key={r._id}
                  className="border-line bg-bg-raised flex flex-wrap items-center justify-between gap-3 rounded-lg border px-5 py-4"
                >
                  <div>
                    <p className="text-ink font-sans font-medium">
                      {r.year}{" "}
                      {r.type === "audit" ? "Audited statement" : "Annual report"}
                    </p>
                    {r.summary && (
                      <p className="text-ink-soft mt-1 font-sans text-sm">{r.summary}</p>
                    )}
                  </div>
                  {r.fileUrl && (
                    <a
                      href={r.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent font-sans text-sm underline underline-offset-2"
                    >
                      Download &rarr;
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Governance / team */}
      {team.length > 0 && (
        <section className="border-line border-t">
          <div className="mx-auto max-w-[var(--container-content)] px-6 py-20 md:py-24">
            <h2 className="text-ink font-display text-3xl">Governance</h2>
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

      {/* Partners */}
      {partners.length > 0 && (
        <section className="border-line bg-bg-raised border-t">
          <div className="mx-auto max-w-[var(--container-content)] px-6 py-20">
            <h2 className="text-ink font-display text-3xl">Partners</h2>
            <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-6">
              {partners.map((p) =>
                p.logo ? (
                  <div key={p._id} className="relative h-10 w-32">
                    <Image
                      src={urlFor(p.logo).height(80).fit("max").url()}
                      alt={p.logo.alt ?? p.name}
                      fill
                      sizes="128px"
                      className="object-contain opacity-70"
                    />
                  </div>
                ) : (
                  <span key={p._id} className="text-ink-soft font-sans text-sm">
                    {p.name}
                  </span>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* Registration */}
      <section className="border-line border-t">
        <div className="mx-auto max-w-[var(--container-content)] px-6 py-16">
          <h2 className="text-ink font-display text-2xl">Registration</h2>
          <p className="text-ink-soft mt-3 max-w-2xl font-sans text-sm leading-relaxed">
            Hope — placeholder registration details. Replace with the organization&rsquo;s
            legal registration number, jurisdiction and regulator once available. This
            section is intentionally left as a clear placeholder rather than showing
            invented credentials.
          </p>
        </div>
      </section>
    </div>
  );
}
