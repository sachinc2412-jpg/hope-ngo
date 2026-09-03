"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { primaryNav } from "@/lib/nav";

/** Mobile slide-over nav. Closes on navigation via SheetClose wrapping links. */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Open menu"
          className="text-ink focus-visible:outline-accent focus-visible:outline-2 focus-visible:outline-offset-2 md:hidden"
        >
          <Menu className="size-6" />
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle className="font-display text-ink text-2xl">Hope</SheetTitle>
        <SheetDescription className="sr-only">Main navigation</SheetDescription>
        <nav className="mt-10 flex flex-col gap-1">
          {primaryNav.map((link) => (
            <SheetClose asChild key={link.href}>
              <Link
                href={link.href}
                className="text-ink hover:bg-bg-raised rounded-sm py-3 font-sans text-lg"
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
        <div className="mt-auto pt-6">
          <SheetClose asChild>
            <Button asChild className="w-full" size="lg">
              <Link href="/donate">Donate now</Link>
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
