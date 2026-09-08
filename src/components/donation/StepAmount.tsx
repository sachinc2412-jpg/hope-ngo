"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatAed, MIN_AMOUNT_FILS, MAX_AMOUNT_FILS } from "@/lib/validation/donation";

type Tier = { label: string; amountFils: number };

/**
 * Step 1 — amount. Preset tiers (from Sanity, with fallback) + custom entry.
 * No one-time/monthly toggle: Ziina is one-time only, so we don't show a control
 * that can't work. Emits the chosen amount in fils.
 */
export function StepAmount({
  tiers,
  value,
  onSelect,
}: {
  tiers: Tier[];
  value: number | null;
  onSelect: (fils: number) => void;
}) {
  const [custom, setCustom] = useState("");
  const [error, setError] = useState<string | null>(null);

  function applyCustom() {
    const aed = parseFloat(custom);
    if (isNaN(aed)) return setError("Enter a valid amount");
    const fils = Math.round(aed * 100);
    if (fils < MIN_AMOUNT_FILS)
      return setError(`Minimum is ${MIN_AMOUNT_FILS / 100} AED`);
    if (fils > MAX_AMOUNT_FILS)
      return setError(`Maximum is ${MAX_AMOUNT_FILS / 100} AED`);
    setError(null);
    onSelect(fils);
  }

  return (
    <div>
      <h2 className="font-display text-ink text-2xl">Choose an amount</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiers.map((t) => (
          <button
            key={t.amountFils}
            type="button"
            aria-pressed={value === t.amountFils && custom === ""}
            onClick={() => {
              setCustom("");
              setError(null);
              onSelect(t.amountFils);
            }}
            className={`font-display rounded-sm border px-4 py-4 text-2xl transition-colors ${
              value === t.amountFils && custom === ""
                ? "border-accent bg-accent/5 text-ink"
                : "border-line text-ink hover:border-accent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <label className="flex flex-col gap-1">
          <span className="text-ink-soft font-sans text-sm">
            Or enter an amount (AED)
          </span>
          <div className="flex gap-2">
            <input
              type="number"
              inputMode="decimal"
              min={MIN_AMOUNT_FILS / 100}
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Custom"
              className="border-line bg-bg-raised text-ink focus-visible:border-accent h-11 flex-1 rounded-sm border px-3 font-sans outline-none"
            />
            <Button type="button" variant="secondary" onClick={applyCustom}>
              Use
            </Button>
          </div>
        </label>
        {error && <p className="text-danger mt-2 font-sans text-sm">{error}</p>}
      </div>

      {value && (
        <p className="text-ink-soft mt-6 font-sans text-sm">
          Selected: <span className="text-ink font-medium">{formatAed(value)}</span>
        </p>
      )}
    </div>
  );
}
