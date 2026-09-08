import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Proxy (formerly "middleware" — Next 16 renamed the convention). Refreshes the
 * Supabase session on every request and gates /account + /admin. The session
 * logic lives in lib/supabase/middleware.ts (kept as a plain helper).
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // All paths EXCEPT static assets, images, and Sanity Studio (own auth).
    "/((?!_next/static|_next/image|favicon.ico|studio|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
