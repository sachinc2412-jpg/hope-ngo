"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

/** Complete the second factor (TOTP) to raise the session to AAL2. */
export function VerifyForm() {
  const router = useRouter();
  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.mfa.listFactors().then(({ data }) => {
      const totp = data?.totp?.[0];
      if (totp) setFactorId(totp.id);
      else setError("No 2FA factor found. Set it up in Admin → Security.");
    });
  }, []);

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    if (!factorId) return;
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code,
    });
    setLoading(false);
    if (error) setError(error.message);
    else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <form onSubmit={verify} className="mt-8 flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-ink-soft font-sans text-sm">
          Enter the 6-digit code from your authenticator app
        </span>
        <input
          inputMode="numeric"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="input tracking-widest"
          placeholder="123456"
        />
      </label>
      {error && <p className="text-danger font-sans text-sm">{error}</p>}
      <Button type="submit" disabled={loading || !factorId} className="self-start">
        {loading ? "Verifying…" : "Verify"}
      </Button>
    </form>
  );
}
