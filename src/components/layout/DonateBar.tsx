import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Mobile-only pinned donate bar. The primary conversion action never scrolls
 * away on small screens. Hidden on md+ where the header Donate button is always
 * visible. A spacer in the layout reserves its height so it never covers content.
 */
export function DonateBar() {
  return (
    <div className="border-line bg-bg/95 fixed inset-x-0 bottom-0 z-40 border-t px-4 py-3 backdrop-blur md:hidden">
      <Button asChild className="w-full" size="lg">
        <Link href="/donate">Donate now</Link>
      </Button>
    </div>
  );
}
