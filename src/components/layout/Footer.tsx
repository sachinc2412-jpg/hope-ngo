import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { footerNav, socialLinks } from "@/lib/nav";

/** Site footer. Full sitemap + socials + a final donate nudge. */
export function Footer() {
  return (
    <footer className="border-line bg-bg-raised border-t">
      <div className="mx-auto max-w-[var(--container-content)] px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/hope-logo.png"
              alt="Hope — Together for a brighter tomorrow"
              width={180}
              height={178}
              className="h-20 w-auto"
            />
            <p className="text-ink-soft mt-3 max-w-xs font-sans text-sm leading-relaxed">
              Creating access to opportunity, dignity and a better future for communities
              that need it most.
            </p>
            <Button asChild size="sm" className="mt-6">
              <Link href="/donate">Donate now</Link>
            </Button>
          </div>

          {footerNav.map((col) => (
            <div key={col.heading}>
              <h2 className="text-ink-faint font-sans text-xs font-medium tracking-wide uppercase">
                {col.heading}
              </h2>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-ink-soft hover:text-ink font-sans text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-line mt-16 flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ink-faint font-sans text-xs">
            © {new Date().getFullYear()} Hope. Placeholder registration details —
            configured via CMS.
          </p>
          <div className="flex gap-6">
            {socialLinks.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="text-ink-soft hover:text-ink font-sans text-xs transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
