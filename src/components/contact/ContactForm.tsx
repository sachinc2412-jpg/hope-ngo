"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { sendContactAction } from "@/app/contact/actions";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await sendContactAction(form);
    setBusy(false);
    if (res.ok) setDone(true);
    else setError(res.error ?? "Error");
  }

  if (done)
    return (
      <div className="border-line bg-bg-raised rounded-lg border p-6">
        <p className="text-success font-sans font-medium">Message sent.</p>
        <p className="text-ink-soft mt-1 font-sans text-sm">
          We&rsquo;ll get back to you soon.
        </p>
      </div>
    );

  return (
    <form onSubmit={submit} className="flex max-w-md flex-col gap-4">
      <input
        placeholder="Your name"
        value={form.name}
        onChange={(e) => set("name", e.target.value)}
        className="input"
        required
      />
      <input
        type="email"
        placeholder="Your email"
        value={form.email}
        onChange={(e) => set("email", e.target.value)}
        className="input"
        required
      />
      <textarea
        placeholder="Your message"
        value={form.message}
        onChange={(e) => set("message", e.target.value)}
        rows={5}
        className="border-line bg-bg-raised text-ink focus-visible:border-accent rounded-sm border px-3 py-2 font-sans outline-none"
        required
      />
      {error && <p className="text-danger font-sans text-sm">{error}</p>}
      <Button type="submit" disabled={busy} className="self-start">
        {busy ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
