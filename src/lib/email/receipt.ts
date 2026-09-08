import "server-only";
import { getResend, EMAIL_FROM } from "./resend";
import {
  formatAed,
  DESIGNATION_LABELS,
  type Designation,
} from "@/lib/validation/donation";

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );
}

function row(label: string, value: string): string {
  return `<tr><td style="padding:12px 16px;font-size:13px;color:#8a8378;border-bottom:1px solid #e4ded2;">${label}</td><td style="padding:12px 16px;font-size:14px;font-weight:600;color:#1a1714;text-align:right;border-bottom:1px solid #e4ded2;">${value}</td></tr>`;
}

export function receiptHtml(opts: {
  name: string;
  amountFils: number;
  reference: string;
  designation: string;
}): string {
  const cause = DESIGNATION_LABELS[opts.designation as Designation] ?? opts.designation;
  return `<!doctype html><html><body style="margin:0;background:#f7f4ee;font-family:Helvetica,Arial,sans-serif;color:#1a1714;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4ee;padding:32px 0;"><tr><td align="center"><table role="presentation" width="520" cellpadding="0" cellspacing="0" style="background:#fcfaf5;border:1px solid #e4ded2;border-radius:16px;"><tr><td style="padding:32px 36px 8px;"><p style="margin:0;font-size:22px;font-weight:600;">Hope</p></td></tr><tr><td style="padding:8px 36px 0;"><h1 style="margin:0;font-size:26px;line-height:1.2;">Thank you, ${escapeHtml(opts.name)}.</h1><p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:#4a453e;">Your gift is confirmed. This email is your receipt — keep it for your records.</p></td></tr><tr><td style="padding:24px 36px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e4ded2;border-radius:12px;">${row("Amount", formatAed(opts.amountFils))}${row("Cause", cause)}${row("Reference", opts.reference)}</table></td></tr><tr><td style="padding:0 36px 32px;"><p style="margin:0;font-size:13px;line-height:1.6;color:#8a8378;">Hope — placeholder registration details. This receipt is issued for the amount shown. Questions? Just reply to this email.</p></td></tr></table></td></tr></table></body></html>`;
}

/** Send the receipt. Never throws — a mail failure must not fail the webhook. */
export async function sendReceiptEmail(opts: {
  to: string;
  name: string;
  amountFils: number;
  reference: string;
  designation: string;
}): Promise<{ sent: boolean }> {
  const resend = getResend();
  if (!resend) {
    console.warn("Resend not configured — skipping receipt email.");
    return { sent: false };
  }
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: opts.to,
      subject: `Your donation receipt — ${opts.reference}`,
      html: receiptHtml(opts),
    });
    return { sent: true };
  } catch (err) {
    console.error("Failed to send receipt email:", err);
    return { sent: false };
  }
}
