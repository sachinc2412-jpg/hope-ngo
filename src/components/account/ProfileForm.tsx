"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateProfileAction } from "@/app/account/actions";

export function ProfileForm({
  email,
  displayName,
  country,
}: {
  email: string;
  displayName: string;
  country: string;
}) {
  const [name, setName] = useState(displayName);
  const [ctry, setCtry] = useState(country);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const res = await updateProfileAction({ displayName: name, country: ctry });
    setSaving(false);
    setMsg(
      res.ok
        ? { ok: true, text: "Profile saved." }
        : { ok: false, text: res.error ?? "Something went wrong." }
    );
  }

  return (
    <form onSubmit={save} className="mt-8 flex max-w-md flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-ink-soft font-sans text-sm">Email</span>
        <input value={email} disabled className="input opacity-60" />
        <span className="text-ink-faint font-sans text-xs">
          Email is managed by your login and can&rsquo;t be changed here.
        </span>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-ink-soft font-sans text-sm">Display name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-ink-soft font-sans text-sm">Country</span>
        <input value={ctry} onChange={(e) => setCtry(e.target.value)} className="input" />
      </label>
      {msg && (
        <p className={`font-sans text-sm ${msg.ok ? "text-success" : "text-danger"}`}>
          {msg.text}
        </p>
      )}
      <Button type="submit" disabled={saving} className="mt-2 self-start">
        {saving ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
