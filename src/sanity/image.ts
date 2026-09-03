import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/client";

const builder = imageUrlBuilder(client);

/** Build a Sanity CDN image URL. Chain .width().height().url() as needed. */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
