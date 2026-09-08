import { getMapMarkers } from "@/lib/donations/map";
import { ImpactMap } from "@/components/impact/ImpactMap";

// Reads live project coords (cookies via Supabase) — render per request.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Impact — Hope",
  description: "Every project, on the map.",
};

export default async function ImpactPage() {
  const markers = await getMapMarkers();
  return (
    <section className="mx-auto max-w-[var(--container-content)] px-6 py-20 md:py-28">
      <p className="text-ink-faint font-sans text-sm tracking-wide uppercase">
        Where we work
      </p>
      <h1 className="text-ink font-display mt-3 max-w-3xl text-4xl leading-tight tracking-tight md:text-6xl">
        Every project, on the map.
      </h1>
      <p className="text-ink-soft mt-4 max-w-xl font-sans text-lg">
        Explore the places your support reaches. Select a location to learn more.
      </p>
      <div className="mt-12">
        <ImpactMap markers={markers} />
      </div>
    </section>
  );
}
