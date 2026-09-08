"use client";

import { donorSchema, type DonorInput } from "@/lib/validation/donation";

/** Step 3 — donor details. Guests welcome; no account required. */
export function StepDonor({
  value,
  onChange,
  errors,
}: {
  value: DonorInput;
  onChange: (v: DonorInput) => void;
  errors: Partial<Record<keyof DonorInput, string>>;
}) {
  const set = <K extends keyof DonorInput>(k: K, v: DonorInput[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <div>
      <h2 className="font-display text-ink text-2xl">Your details</h2>
      <p className="text-ink-soft mt-2 font-sans text-sm">
        No account needed. We&rsquo;ll email your receipt.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <Field label="Full name" error={errors.name}>
          <input
            type="text"
            value={value.name}
            onChange={(e) => set("name", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <input
            type="email"
            value={value.email}
            onChange={(e) => set("email", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Country" error={errors.country}>
          <input
            type="text"
            value={value.country}
            onChange={(e) => set("country", e.target.value)}
            className="input"
          />
        </Field>

        <label className="mt-1 flex items-center gap-3">
          <input
            type="checkbox"
            checked={value.isAnonymous}
            onChange={(e) => set("isAnonymous", e.target.checked)}
            className="size-4 accent-[var(--color-accent)]"
          />
          <span className="text-ink-soft font-sans text-sm">
            Make my donation anonymous (your name won&rsquo;t be shown publicly)
          </span>
        </label>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-ink-soft font-sans text-sm">{label}</span>
      {children}
      {error && <span className="text-danger font-sans text-sm">{error}</span>}
    </label>
  );
}

export function validateDonor(value: DonorInput) {
  const res = donorSchema.safeParse(value);
  if (res.success) return { ok: true as const, errors: {} };
  const errors: Partial<Record<keyof DonorInput, string>> = {};
  for (const issue of res.error.issues) {
    const key = issue.path[0] as keyof DonorInput;
    if (!errors[key]) errors[key] = issue.message;
  }
  return { ok: false as const, errors };
}
