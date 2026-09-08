"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

type Enrolling = { factorId: string; qr: string; secret: string };

/** TOTP 2FA setup: enroll -> scan QR -> verify code -> active. Unenroll if set. */
export function SecurityForm() {
  const [hasFactor, setHasFactor] = useState<boolean | null>(null);
  const [existingId, setExistingId] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState<Enrolling | null>(null);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const supabase = createClient();
    const { data } = await supabase.auth.mfa.listFactors();
    const totp = data?.totp?.[0];
    setHasFactor(Boolean(totp));
    setExistingId(totp?.id ?? null);
  }
  useEffect(() => {
    let active = true;
    createClient()
      .auth.mfa.listFactors()
      .then(({ data }) => {
        if (!active) return;
        const totp = data?.totp?.[0];
        setHasFactor(Boolean(totp));
        setExistingId(totp?.id ?? null);
      });
    return () => {
      active = false;
    };
  }, []);

  async function startEnroll() {
    setBusy(true);
    setMsg(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
    });
    setBusy(false);
    if (error || !data) return setMsg({ ok: false, text: error?.message ?? "Error" });
    setEnrolling({
      factorId: data.id,
      qr: data.totp.qr_code,
      secret: data.totp.secret,
    });
  }

  async function confirmEnroll(e: React.FormEvent) {
    e.preventDefault();
    if (!enrolling) return;
    setBusy(true);
    setMsg(null);
    const supabase = createClient();
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId: enrolling.factorId,
      code,
    });
    setBusy(false);
    if (error) return setMsg({ ok: false, text: error.message });
    setEnrolling(null);
    setCode("");
    setMsg({ ok: true, text: "Two-factor authentication is now on." });
    refresh();
  }

  async function disable() {
    if (!existingId) return;
    setBusy(true);
    const supabase = createClient();
    await supabase.auth.mfa.unenroll({ factorId: existingId });
    setBusy(false);
    setMsg({ ok: true, text: "Two-factor authentication disabled." });
    refresh();
  }

  if (hasFactor === null) return <p className="text-ink-faint mt-6">Loading…</p>;

  return (
    <div className="mt-6 max-w-md">
      {hasFactor ? (
        <div className="border-line bg-bg-raised rounded-lg border p-6">
          <p className="text-success font-sans font-medium">2FA is enabled.</p>
          <p className="text-ink-soft mt-1 font-sans text-sm">
            You&rsquo;ll be asked for a code from your authenticator app on sign-in.
          </p>
          <Button
            onClick={disable}
            variant="secondary"
            size="sm"
            className="mt-4"
            disabled={busy}
          >
            Disable 2FA
          </Button>
        </div>
      ) : enrolling ? (
        <form
          onSubmit={confirmEnroll}
          className="border-line bg-bg-raised rounded-lg border p-6"
        >
          <p className="text-ink font-sans font-medium">
            Scan this in your authenticator app
          </p>
          {/* Supabase may return a data URI OR raw SVG markup. Handle both. */}
          {enrolling.qr.trim().startsWith("<svg") ? (
            <div
              className="mt-4 h-44 w-44"
              dangerouslySetInnerHTML={{ __html: enrolling.qr }}
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={enrolling.qr} alt="2FA QR code" className="mt-4 h-44 w-44" />
          )}
          <p className="text-ink-faint mt-2 font-sans text-xs break-all">
            Or enter this key manually: {enrolling.secret}
          </p>
          <label className="mt-4 flex flex-col gap-1">
            <span className="text-ink-soft font-sans text-sm">
              Enter the 6-digit code
            </span>
            <input
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="input tracking-widest"
              placeholder="123456"
            />
          </label>
          <Button type="submit" className="mt-4" disabled={busy}>
            {busy ? "Verifying…" : "Turn on 2FA"}
          </Button>
        </form>
      ) : (
        <div className="border-line bg-bg-raised rounded-lg border p-6">
          <p className="text-ink font-sans font-medium">
            Two-factor authentication is off.
          </p>
          <p className="text-ink-soft mt-1 font-sans text-sm">
            Strongly recommended for admin accounts. Requires an authenticator app (Google
            Authenticator, Authy, 1Password, etc).
          </p>
          <Button onClick={startEnroll} className="mt-4" disabled={busy}>
            {busy ? "Starting…" : "Enable 2FA"}
          </Button>
        </div>
      )}
      {msg && (
        <p
          className={`mt-4 font-sans text-sm ${msg.ok ? "text-success" : "text-danger"}`}
        >
          {msg.text}
        </p>
      )}
    </div>
  );
}
