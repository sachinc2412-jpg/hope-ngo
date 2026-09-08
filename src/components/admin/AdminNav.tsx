"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const TABS = [
  { label: "Overview", href: "/admin" },
  { label: "Donations", href: "/admin/donations" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Stories", href: "/admin/stories" },
  { label: "Updates", href: "/admin/impact-updates" },
  { label: "Donors", href: "/admin/donors" },
  { label: "Audit", href: "/admin/audit" },
  { label: "Security", href: "/admin/security" },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <div className="border-line flex flex-wrap items-center justify-between gap-4 border-b pb-3">
      <nav className="flex flex-wrap gap-5">
        {TABS.map((t) => {
          const active =
            t.href === "/admin" ? path === "/admin" : path.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`font-sans text-sm transition-colors ${
                active ? "text-ink font-medium" : "text-ink-faint hover:text-ink"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
      <form action="/auth/sign-out" method="post">
        <Button type="submit" variant="ghost" size="sm">
          Sign out
        </Button>
      </form>
    </div>
  );
}
