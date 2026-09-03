import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on all paths EXCEPT static assets, images, and the Sanity Studio
     * (which manages its own auth).
     */
    "/((?!_next/static|_next/image|favicon.ico|studio|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
