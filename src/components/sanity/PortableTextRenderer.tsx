import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "@portabletext/react";
import { urlFor } from "@/sanity/image";

/** Renders Sanity Portable Text with styling that matches the design system. */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-ink-soft mb-5 font-sans text-lg leading-relaxed">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="font-display text-ink mt-12 mb-4 text-3xl">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-ink mt-8 mb-3 text-2xl">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-accent font-display text-ink my-8 border-l-2 pl-6 text-2xl italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="text-ink font-semibold">{children}</strong>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="text-accent underline underline-offset-2"
        rel="noreferrer"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => (
      <figure className="my-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={urlFor(value).width(1200).auto("format").url()}
          alt={value?.alt ?? ""}
          className="w-full rounded-lg"
        />
      </figure>
    ),
  },
};

export function PortableTextRenderer({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}
