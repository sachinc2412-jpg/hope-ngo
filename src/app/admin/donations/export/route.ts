import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";

/**
 * CSV export of donations (respecting the current search/filter). STREAMS the
 * file in pages instead of loading the whole table into memory or the browser.
 * Admin-gated by requireAdmin(); the underlying view is RLS-protected too.
 */
export async function GET(req: NextRequest) {
  await requireAdmin();

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").replace(/[,()%*]/g, "");
  const status = url.searchParams.get("status") ?? "all";

  const supabase = await createClient();
  const PAGE = 500;

  const encoder = new TextEncoder();
  const csvCell = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return `"${s.replace(/"/g, '""')}"`;
  };

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(
        encoder.encode(
          "date,reference,donor,email,amount_aed,currency,designation,status\n"
        )
      );
      let from = 0;
      for (;;) {
        let query = supabase
          .from("admin_donations")
          .select("*")
          .order("created_at", { ascending: false })
          .range(from, from + PAGE - 1);
        if (status !== "all") query = query.eq("status", status);
        if (q)
          query = query.or(
            `reference.ilike.%${q}%,donor_email.ilike.%${q}%,donor_name.ilike.%${q}%`
          );
        const { data, error } = await query;
        if (error || !data || data.length === 0) break;

        for (const r of data) {
          const donor = r.is_anonymous
            ? "Anonymous"
            : (r.donor_name ?? r.donor_email ?? "");
          const line =
            [
              csvCell(r.created_at),
              csvCell(r.reference),
              csvCell(donor),
              csvCell(r.is_anonymous ? "" : r.donor_email),
              csvCell((r.amount_cents / 100).toFixed(2)),
              csvCell(r.currency),
              csvCell(r.designation),
              csvCell(r.status),
            ].join(",") + "\n";
          controller.enqueue(encoder.encode(line));
        }
        if (data.length < PAGE) break;
        from += PAGE;
      }
      controller.close();
    },
  });

  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(stream, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="donations-${stamp}.csv"`,
    },
  });
}
