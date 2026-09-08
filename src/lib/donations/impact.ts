import type { Designation } from "@/lib/validation/donation";

/**
 * Qualitative impact statements per cause. Intentionally NOT quantitative — no
 * invented "you fed N people" numbers. Encouraging + honest. Editors can later
 * move these to Sanity if they want per-project statements.
 */
export const IMPACT_STATEMENTS: Record<Designation, string> = {
  most_needed: "Your gift goes exactly where it's needed most today.",
  education: "You're helping open the door to education.",
  healthcare: "You're helping bring care to people who need it.",
  food: "You're helping put food on the table.",
  water: "You're helping bring clean water within reach.",
  project: "You're powering a specific project forward.",
};
