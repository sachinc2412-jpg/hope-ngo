"use server";

import { z } from "zod";
import { getResend, EMAIL_FROM } from "@/lib/email/resend";

const contactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.email(),
  message: z.string().min(1).max(4000),
});

/** Contact form -> emails the org via Resend. Falls back gracefully if Resend or
 *  CONTACT_EMAIL isn't configured. */
export async function sendContactAction(input: {
  name: string;
  email: string;
  message: string;
}): Promise<{ ok: boolean; error?: string }> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };

  const to = process.env.CONTACT_EMAIL;
  const resend = getResend();
  if (!resend || !to) {
    return {
      ok: false,
      error: "Contact isn't configured yet. Please email us directly.",
    };
  }

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to,
      replyTo: parsed.data.email,
      subject: `Contact form: ${parsed.data.name}`,
      text: `From: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not send. Please try again." };
  }
}
