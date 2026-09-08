"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/** Share via the Web Share API where available, else copy the link. */
export function ShareButton({ url, text }: { url: string; text: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Hope", text, url });
        return;
      } catch {
        // user cancelled — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked — no-op
    }
  }

  return (
    <Button type="button" variant="secondary" onClick={share}>
      {copied ? "Link copied" : "Share"}
    </Button>
  );
}
