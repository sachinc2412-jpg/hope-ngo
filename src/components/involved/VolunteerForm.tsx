"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { submitVolunteerAction } from "@/app/get-involved/actions";

export function VolunteerForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    interest: "",
    message: "",
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await submitVolunteerAction(form);
    setBusy(false);
    if (res.ok) setDone(true);
    else setError(res.error ?? "Error");
  }

  if (done) {
    return (
      <div className="border-line bg-bg-raised rounded-lg border p-6">
        <p className="text-success font-sans font-medium">Thank you!</p>
        <p className="text-ink-soft mt-1 font-sans text-sm">
          We&rsquo;ve received your interest and will be in touch.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex max-w-md flex-col gap-4">
      <input
        placeholder="Full name"
        value={form.name}
        onChange={(e) => set("name", e.target.value)}
        className="input"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => set("email", e.target.value)}
        className="input"
        required
      />
      <input
        placeholder="How would you like to help? (optional)"
        value={form.interest}
        onChange={(e) => set("interest", e.target.value)}
        className="input"
      />
      <textarea
        placeholder="Anything else? (optional)"
        value={form.message}
        onChange={(e) => set("message", e.target.value)}
        rows={4}
        className="border-line bg-bg-raised text-ink focus-visible:border-accent rounded-sm border px-3 py-2 font-sans outline-none"
      />
      {error && <p className="text-danger font-sans text-sm">{error}</p>}
      <Button type="submit" disabled={busy} className="self-start">
        {busy ? "Submitting…" : "Submit"}
      </Button>
    </form>
  );
}
