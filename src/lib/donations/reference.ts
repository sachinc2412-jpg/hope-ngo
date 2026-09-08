import { randomBytes } from "crypto";

/** Human-ish unique donation reference, e.g. HOPE-7F3K9Q2A. */
export function generateReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous 0/O/1/I
  const bytes = randomBytes(8);
  let out = "";
  for (let i = 0; i < 8; i++) out += chars[bytes[i] % chars.length];
  return `HOPE-${out}`;
}
