import "server-only";
import { Resend } from "resend";

/** Resend client. Lazily constructed so a missing key doesn't crash at import. */
export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key || key.startsWith("placeholder")) return null;
  return new Resend(key);
}

/** From address — set a verified-domain sender in prod. onboarding@resend.dev
 *  only delivers to your own Resend account email (fine for testing). */
export const EMAIL_FROM = process.env.RESEND_FROM || "Hope <onboarding@resend.dev>";
