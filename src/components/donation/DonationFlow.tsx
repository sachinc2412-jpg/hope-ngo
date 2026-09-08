"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/donation/StepIndicator";
import { StepAmount } from "@/components/donation/StepAmount";
import { StepDesignation } from "@/components/donation/StepDesignation";
import { StepDonor, validateDonor } from "@/components/donation/StepDonor";
import { createDonationAction } from "@/app/donate/actions";
import {
  formatAed,
  DESIGNATION_LABELS,
  type Designation,
  type DonorInput,
} from "@/lib/validation/donation";

type Tier = { label: string; amountFils: number };

/**
 * Donation flow (Ziina, one-time). Days 12–13: steps 1–3 (amount, cause, donor)
 * fully working with validation. Step 4 (payment) is wired to the payment
 * provider on Day 14 — today it shows a confirmed summary + a stubbed Continue.
 */
export function DonationFlow({
  tiers,
  initialAmountFils,
  initialDesignation,
  projectSlug,
  projectName,
}: {
  tiers: Tier[];
  initialAmountFils?: number;
  initialDesignation?: Designation;
  projectSlug?: string;
  projectName?: string;
}) {
  const [step, setStep] = useState(1);
  const [amountFils, setAmountFils] = useState<number | null>(initialAmountFils ?? null);
  const [designation, setDesignation] = useState<Designation | null>(
    initialDesignation ?? (projectSlug ? "project" : null)
  );
  const [donor, setDonor] = useState<DonorInput>({
    name: "",
    email: "",
    country: "United Arab Emirates",
    isAnonymous: false,
  });
  const [donorErrors, setDonorErrors] = useState<
    Partial<Record<keyof DonorInput, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function submit() {
    if (amountFils === null || designation === null) return;
    setSubmitting(true);
    setSubmitError(null);
    const res = await createDonationAction({
      amountFils,
      designation,
      projectSlug,
      name: donor.name,
      email: donor.email,
      country: donor.country,
      isAnonymous: donor.isAnonymous,
    });
    if ("error" in res) {
      setSubmitError(res.error);
      setSubmitting(false);
      return;
    }
    window.location.href = res.redirectUrl;
  }

  function next() {
    if (step === 3) {
      const { ok, errors } = validateDonor(donor);
      setDonorErrors(errors);
      if (!ok) return;
    }
    setStep((s) => s + 1);
  }

  const canContinue =
    (step === 1 && amountFils !== null) ||
    (step === 2 && designation !== null) ||
    step === 3;

  return (
    <div className="mx-auto max-w-xl">
      <StepIndicator current={step} />

      <div className="mt-10">
        {step === 1 && (
          <StepAmount tiers={tiers} value={amountFils} onSelect={setAmountFils} />
        )}
        {step === 2 && (
          <StepDesignation
            value={designation}
            projectName={projectName}
            onSelect={setDesignation}
          />
        )}
        {step === 3 && (
          <StepDonor value={donor} onChange={setDonor} errors={donorErrors} />
        )}
        {step === 4 && (
          <div className="border-line bg-bg-raised rounded-lg border p-6">
            <h2 className="font-display text-ink text-2xl">Review</h2>
            <dl className="mt-4 space-y-2 font-sans text-sm">
              <Row label="Amount" value={formatAed(amountFils ?? 0)} />
              <Row
                label="Cause"
                value={designation ? DESIGNATION_LABELS[designation] : ""}
              />
              {projectName && <Row label="Project" value={projectName} />}
              <Row label="Donor" value={donor.isAnonymous ? "Anonymous" : donor.name} />
              <Row label="Email" value={donor.email} />
            </dl>
            <p className="text-ink-faint mt-6 font-sans text-sm">
              You&rsquo;ll be taken to a secure payment page. No account needed.
            </p>
            {submitError && (
              <p className="text-danger mt-3 font-sans text-sm">{submitError}</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
        >
          Back
        </Button>
        {step < 4 ? (
          <Button type="button" onClick={next} disabled={!canContinue}>
            {step === 3 ? "Review" : "Continue"}
          </Button>
        ) : (
          <Button type="button" onClick={submit} disabled={submitting}>
            {submitting ? "Starting payment…" : "Proceed to payment"}
          </Button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-faint">{label}</dt>
      <dd className="text-ink text-right font-medium">{value}</dd>
    </div>
  );
}
