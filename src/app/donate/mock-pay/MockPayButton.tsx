"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { completeMockPayment } from "./actions";

export function MockPayButton({
  pi,
  reference,
  amountFils,
}: {
  pi: string;
  reference: string;
  amountFils: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function pay(outcome: "completed" | "failed") {
    setLoading(true);
    const res = await completeMockPayment(pi, reference, amountFils, outcome);
    if (res.ok && outcome === "completed")
      router.push(`/donate/success?ref=${reference}`);
    else router.push(`/donate?failed=1`);
  }

  return (
    <div className="flex flex-col gap-3">
      <Button onClick={() => pay("completed")} disabled={loading} className="w-full">
        {loading ? "Processing…" : "Pay now (simulate success)"}
      </Button>
      <Button
        onClick={() => pay("failed")}
        disabled={loading}
        variant="ghost"
        className="w-full"
      >
        Simulate failed payment
      </Button>
    </div>
  );
}
