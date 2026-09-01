import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

/**
 * Fonts are self-hosted (variable woff2 vendored in ./fonts), not fetched from
 * Google. Two reasons: (1) no build-time or runtime dependency on Google's
 * servers; (2) no third-party request from a page that will handle EU donor
 * data — one less GDPR liability. To swap a face later, replace the woff2 and
 * the src path; nothing else changes.
 */
const fraunces = localFont({
  src: "./fonts/fraunces-variable.woff2",
  display: "swap",
  variable: "--font-display",
  weight: "100 900", // variable range
});

const inter = localFont({
  src: "./fonts/inter-variable.woff2",
  display: "swap",
  variable: "--font-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  // Placeholder — replaced from the Sanity homepage singleton on Day 5.
  title: "Hope — Together, we can change what tomorrow looks like",
  description:
    "Every contribution helps create access to opportunity, dignity and a better future for communities that need it most.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-dvh bg-bg font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
