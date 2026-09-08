"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

/** Sub-nav for the donor area (Overview / Profile) + sign out. */
export function AccountNav() {
  const path = usePathname();
  const tabs = [
    { label: "Overview", href: "/account" },
    { label: "Profile", href: "/account/profile" },
  ];
  return (
    <div className="border-line mt-6 flex items-center justify-between border-b pb-3">
      <nav className="flex gap-6">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`font-sans text-sm transition-colors ${
              path === t.href ? "text-ink font-medium" : "text-ink-faint hover:text-ink"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      <form action="/auth/sign-out" method="post">
        <Button type="submit" variant="ghost" size="sm">
          Sign out
        </Button>
      </form>
    </div>
  );
}
