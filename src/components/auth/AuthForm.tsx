"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

/** Email/password auth form. mode toggles sign-in vs sign-up. */
export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    const supabase = createClient();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setNotice("Check your email to confirm your account, then sign in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(error.message);
      else {
        router.push(redirect);
        router.refresh();
      }
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-ink-soft font-sans text-sm">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-line bg-bg-raised text-ink focus-visible:border-accent h-11 rounded-sm border px-3 font-sans outline-none"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-ink-soft font-sans text-sm">Password</span>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-line bg-bg-raised text-ink focus-visible:border-accent h-11 rounded-sm border px-3 font-sans outline-none"
        />
      </label>

      {error && <p className="text-danger font-sans text-sm">{error}</p>}
      {notice && <p className="text-success font-sans text-sm">{notice}</p>}

      <Button type="submit" size="lg" disabled={loading} className="mt-2">
        {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
      </Button>

      <p className="text-ink-soft mt-2 font-sans text-sm">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/sign-in" className="text-accent underline underline-offset-2">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/sign-up" className="text-accent underline underline-offset-2">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
