"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createProjectAction } from "@/app/admin/projects/actions";

/** Create the Postgres financial row for a project (content added in Studio). */
export function AddProject() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState("");
  const [goalAed, setGoalAed] = useState("");
  const [status, setStatus] = useState<"draft" | "active">("draft");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    setSaving(true);
    setError(null);
    const res = await createProjectAction({
      slug: slug.trim(),
      goalAed: goalAed.trim() === "" ? null : parseFloat(goalAed),
      status,
    });
    setSaving(false);
    if (res.ok) {
      setSlug("");
      setGoalAed("");
      setOpen(false);
      router.refresh();
    } else setError(res.error ?? "Error");
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} size="sm" variant="secondary">
        + Add project
      </Button>
    );
  }

  return (
    <div className="border-line bg-bg-raised rounded-lg border p-4">
      <p className="text-ink font-sans text-sm font-medium">
        New project (financial row)
      </p>
      <p className="text-ink-faint mt-1 font-sans text-xs">
        Use the SAME slug as its Sanity content doc — that&rsquo;s the join key.
      </p>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="project-slug"
          className="input !h-10 w-48"
        />
        <input
          type="number"
          value={goalAed}
          onChange={(e) => setGoalAed(e.target.value)}
          placeholder="Goal AED"
          className="input !h-10 w-32"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "draft" | "active")}
          className="input !h-10 w-32"
        >
          <option value="draft">draft</option>
          <option value="active">active</option>
        </select>
        <Button onClick={create} size="sm" disabled={saving}>
          {saving ? "Creating…" : "Create"}
        </Button>
        <Button onClick={() => setOpen(false)} size="sm" variant="ghost">
          Cancel
        </Button>
        {error && <span className="text-danger font-sans text-sm">{error}</span>}
      </div>
    </div>
  );
}
