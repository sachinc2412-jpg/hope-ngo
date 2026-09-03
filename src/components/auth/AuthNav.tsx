"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

/**
 * Session-aware nav link, client-side so it doesn't force the whole site to
 * render dynamically (pages stay static/ISR). Security-gated content still
 * checks the session on the server; this is only cosmetic nav.
 */
export function AuthNav() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setSignedIn(!!session?.user)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  // Avoid a flash: render nothing until we know the state.
  if (signedIn === null) return null;

  return (
    <Link
      href={signedIn ? "/account" : "/sign-in"}
      className="text-ink-soft hover:text-ink hidden font-sans text-sm transition-colors md:inline-block"
    >
      {signedIn ? "Account" : "Sign in"}
    </Link>
  );
}
