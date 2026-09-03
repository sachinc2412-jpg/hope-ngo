import Image from "next/image";
import { urlFor } from "@/sanity/image";
import type { SanityImage as SanityImageType } from "@/sanity/types";

/**
 * next/image wrapper for Sanity images. Uses the CDN URL builder and always
 * requires alt text (empty string only for decorative images). `fill` mode by
 * default — parent must be position:relative with a set size.
 */
export function SanityImage({
  image,
  sizes = "100vw",
  priority = false,
  className,
}: {
  image: SanityImageType;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const url = urlFor(image).width(1600).fit("max").auto("format").url();
  return (
    <Image
      src={url}
      alt={image.alt ?? ""}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
