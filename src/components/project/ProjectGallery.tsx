import { SanityImage } from "@/components/sanity/SanityImage";
import type { SanityImage as SanityImageType } from "@/sanity/types";

/** Photo gallery for a project detail page. Renders nothing if empty. */
export function ProjectGallery({ images }: { images?: SanityImageType[] }) {
  if (!images || images.length === 0) return null;
  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-2">
      {images.map((img, i) => (
        <div key={i} className="bg-line relative aspect-[4/3] overflow-hidden rounded-lg">
          <SanityImage
            image={img}
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
