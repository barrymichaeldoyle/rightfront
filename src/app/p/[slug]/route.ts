import { NextRequest } from "next/server";

import { eq, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { userLinks } from "@/lib/schema";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug: rawSlug } = await context.params;
  const slug = (rawSlug || "").trim().toLowerCase();

  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  let rows: Array<{ appId: string }> = [];
  try {
    rows = await db
      .select({ appId: userLinks.appId })
      .from(userLinks)
      .where(eq(userLinks.slug, slug))
      .limit(1);
  } catch (err) {
    const e = err as { code?: string; message?: string; cause?: unknown };
    const msg = String(e?.message ?? "");
    const causeMsg =
      e?.cause && typeof e.cause === "object" && "message" in e.cause
        ? String((e.cause as { message?: unknown }).message ?? "")
        : "";
    const combined = `${msg}\n${causeMsg}`.toLowerCase();
    // If DB isn't migrated yet, return 404 instead of crashing edge/server.
    if (
      e?.code === "42P01" ||
      combined.includes('relation "user_links" does not exist')
    ) {
      return new Response("Not found", { status: 404 });
    }
    throw err;
  }

  const row = rows[0];
  if (!row) {
    return new Response("Not found", { status: 404 });
  }

  // Increment clicks best-effort; do not block the redirect on failures.
  try {
    await db
      .update(userLinks)
      .set({
        clicks: sql`${userLinks.clicks} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(userLinks.slug, slug));
  } catch {
    // ignore
  }

  const dest = new URL(`/link?id=${encodeURIComponent(row.appId)}`, req.url);
  return Response.redirect(dest, 302);
}
