"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateProjectAction } from "@/app/admin/projects/actions";
import { formatAed } from "@/lib/validation/donation";

const STATUSES = ["draft", "active", "funded", "closed"] as const;

export function ProjectRow({
  id,
  slug,
  status: initialStatus,
  goalCents,
  raisedCents,
}: {
  id: string;
  slug: string;
  status: string;
  goalCents: number | null;
  raisedCents: number;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [goalAed, setGoalAed] = useState(
    goalCents !== null ? String(goalCents / 100) : ""
  );
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setMsg(null);
    const res = await updateProjectAction({
      id,
      goalAed: goalAed.trim() === "" ? null : parseFloat(goalAed),
      status: status as (typeof STATUSES)[number],
    });
    setSaving(false);
    setMsg(res.ok ? "Saved" : (res.error ?? "Error"));
  }

  return (
    <div className="border-line bg-bg-raised rounded-lg border p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-ink font-mono text-sm">{slug}</p>
        <p className="text-ink-faint font-sans text-xs">
          Raised {formatAed(raisedCents)}
          {goalCents ? ` of ${formatAed(goalCents)}` : ""}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-ink-faint font-sans text-xs">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input !h-10 w-36"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-ink-faint font-sans text-xs">Goal (AED)</span>
          <input
            type="number"
            value={goalAed}
            onChange={(e) => setGoalAed(e.target.value)}
            placeholder="No goal"
            className="input !h-10 w-40"
          />
        </label>
        <Button onClick={save} size="sm" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
        <a
          href="/studio"
          target="_blank"
          rel="noreferrer"
          className="text-accent font-sans text-sm underline underline-offset-2"
        >
          Edit content in Studio &rarr;
        </a>
        {msg && (
          <span
            className={`font-sans text-sm ${msg === "Saved" ? "text-success" : "text-danger"}`}
          >
            {msg}
          </span>
        )}
      </div>
    </div>
  );
}
