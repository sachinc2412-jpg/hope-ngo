"use client";

import {
  DESIGNATIONS,
  DESIGNATION_LABELS,
  type Designation,
} from "@/lib/validation/donation";

/** Step 2 — where the gift goes. */
export function StepDesignation({
  value,
  projectName,
  onSelect,
}: {
  value: Designation | null;
  projectName?: string;
  onSelect: (d: Designation) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-ink text-2xl">Where should it go?</h2>
      {projectName && (
        <p className="text-ink-soft mt-2 font-sans text-sm">
          Supporting: <span className="text-ink font-medium">{projectName}</span>
        </p>
      )}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {DESIGNATIONS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => onSelect(d)}
            className={`rounded-sm border px-5 py-4 text-left font-sans transition-colors ${
              value === d
                ? "border-accent bg-accent/5 text-ink"
                : "border-line text-ink-soft hover:border-accent hover:text-ink"
            }`}
          >
            {DESIGNATION_LABELS[d]}
          </button>
        ))}
      </div>
    </div>
  );
}
