/** Progress indicator across the 4 donation steps. */
const STEPS = ["Amount", "Cause", "Details", "Payment"] as const;

export function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Donation progress">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const active = step === current;
        const done = step < current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                active
                  ? "bg-accent text-accent-ink"
                  : done
                    ? "bg-accent/20 text-accent"
                    : "bg-line text-ink-faint"
              }`}
              aria-current={active ? "step" : undefined}
            >
              {step}
            </span>
            <span
              className={`hidden text-sm sm:inline ${active ? "text-ink" : "text-ink-faint"}`}
            >
              {label}
            </span>
            {step < STEPS.length && <span className="bg-line h-px flex-1" />}
          </li>
        );
      })}
    </ol>
  );
}
