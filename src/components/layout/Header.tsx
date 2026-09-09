import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/MobileNav";
import { AuthNav } from "@/components/auth/AuthNav";
import { primaryNav } from "@/lib/nav";

/**
 * Site header. Wordmark + desktop nav + persistent Donate button. Stays a static
 * server component; the only dynamic piece is the small client-side AuthNav link,
 * so pages keep static/ISR rendering.
 */
export function Header() {
  return (
    <header className="border-line bg-bg/90 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[var(--container-content)] items-center justify-between px-6">
        <Link
          href="/"
          className="focus-visible:outline-accent flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2"
          aria-label="Hope — home"
        >
          <Image
            src="/hope-mark.png"
            alt=""
            width={36}
            height={35}
            className="h-9 w-auto"
            priority
          />
          <span className="text-ink font-display text-2xl tracking-tight">Hope</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {primaryNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ink-soft hover:text-ink focus-visible:outline-accent font-sans text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <AuthNav />
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/donate">Donate</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
