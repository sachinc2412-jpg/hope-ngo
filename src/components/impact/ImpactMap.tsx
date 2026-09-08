"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { MapMarker } from "@/lib/donations/map";

/**
 * Interactive impact map. Renders Mapbox pins when a token is set; ALWAYS renders
 * a text fallback list below (keyboard + screen-reader + no-token path). Clicking
 * a pin selects a project and shows its card. The list is the accessible route.
 */
export function ImpactMap({ markers }: { markers: MapMarker[] }) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<MapMarker | null>(null);

  useEffect(() => {
    if (!token || !containerRef.current || markers.length === 0) return;
    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [markers[0].lng, markers[0].lat],
      zoom: 2,
    });
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    const bounds = new mapboxgl.LngLatBounds();
    for (const m of markers) {
      const marker = new mapboxgl.Marker({ color: "#1B4965" })
        .setLngLat([m.lng, m.lat])
        .addTo(map);
      marker.getElement().style.cursor = "pointer";
      marker.getElement().addEventListener("click", () => setSelected(m));
      bounds.extend([m.lng, m.lat]);
    }
    if (markers.length > 1) map.fitBounds(bounds, { padding: 60, maxZoom: 6 });

    return () => map.remove();
  }, [token, markers]);

  return (
    <div>
      {token && markers.length > 0 ? (
        <div className="relative">
          <div
            ref={containerRef}
            className="border-line h-[60vh] min-h-[420px] w-full overflow-hidden rounded-lg border"
            aria-label="Map of project locations"
          />
          {selected && (
            <div className="border-line bg-bg-raised absolute bottom-4 left-4 max-w-xs rounded-lg border p-4 shadow-lg">
              {selected.location && (
                <p className="text-ink-faint font-sans text-xs tracking-wide uppercase">
                  {selected.location}
                </p>
              )}
              <p className="text-ink font-display mt-1 text-lg">{selected.title}</p>
              <Link
                href={`/projects/${selected.slug}`}
                className="text-accent mt-2 inline-block font-sans text-sm underline underline-offset-2"
              >
                View project &rarr;
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="border-line bg-bg-raised flex aspect-[16/9] w-full items-center justify-center rounded-lg border border-dashed text-center">
          <p className="text-ink-faint font-sans text-sm">
            {markers.length === 0
              ? "Project locations will appear here once projects have coordinates."
              : "Map unavailable. Browse project locations below."}
          </p>
        </div>
      )}

      {/* Accessible fallback / always-present list */}
      {markers.length > 0 && (
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {markers.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/projects/${m.slug}`}
                className="border-line hover:border-accent block rounded-lg border p-4 transition-colors"
              >
                {m.location && (
                  <p className="text-ink-faint font-sans text-xs tracking-wide uppercase">
                    {m.location}
                  </p>
                )}
                <p className="text-ink font-display mt-1 text-lg">{m.title}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
