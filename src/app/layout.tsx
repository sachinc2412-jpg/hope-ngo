import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DonateBar } from "@/components/layout/DonateBar";

/**
 * Fonts are self-hosted (variable woff2 vendored in ./fonts), not fetched from
 * Google — no build/runtime dependency on Google's servers, and no third-party
 * request from pages that handle EU donor data (one less GDPR liability).
 */
const fraunces = localFont({
  src: "./fonts/fraunces-variable.woff2",
  display: "swap",
  variable: "--font-display",
  weight: "100 900",
});

const inter = localFont({
  src: "./fonts/inter-variable.woff2",
  display: "swap",
  variable: "--font-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Hope — Together, we can change what tomorrow looks like",
  description:
    "Every contribution helps create access to opportunity, dignity and a better future for communities that need it most.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="bg-bg text-ink flex min-h-dvh flex-col font-sans antialiased">
        <a
          href="#main-content"
          className="focus:bg-accent focus:text-accent-ink sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-sm focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        {/* Spacer so the fixed mobile DonateBar never covers footer content. */}
        <div aria-hidden className="h-[68px] md:hidden" />
        <DonateBar />
      </body>
    </html>
  );
}
