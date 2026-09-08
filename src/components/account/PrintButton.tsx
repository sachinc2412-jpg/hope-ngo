"use client";

import { Button } from "@/components/ui/button";

/** Print / save-as-PDF via the browser. */
export function PrintButton() {
  return (
    <Button type="button" onClick={() => window.print()} className="no-print">
      Download / print
    </Button>
  );
}
