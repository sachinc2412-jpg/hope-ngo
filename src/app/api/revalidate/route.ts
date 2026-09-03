import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook → on-demand revalidation. When a document is published, Sanity
 * POSTs here; we verify the signature against SANITY_REVALIDATE_SECRET, then
 * invalidate the cache tag for that document type. The site shows new content
 * within seconds, no rebuild.
 *
 * Configure in sanity.io/manage → API → Webhooks:
 *   URL:    https://<your-domain>/api/revalidate
 *   Trigger: on create / update / delete
 *   Secret:  same value as SANITY_REVALIDATE_SECRET
 *   Projection: { "_type": _type }
 */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type: string }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      return new NextResponse("Invalid signature", { status: 401 });
    }
    if (!body?._type) {
      return new NextResponse("Bad request: missing _type", { status: 400 });
    }

    revalidateTag(body._type, "max");
    return NextResponse.json({ revalidated: true, type: body._type });
  } catch (err) {
    console.error("Revalidate webhook error:", err);
    return new NextResponse("Error", { status: 500 });
  }
}
