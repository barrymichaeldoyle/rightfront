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

  const rows = await db
    .select({ appId: userLinks.appId })
    .from(userLinks)
    .where(eq(userLinks.slug, slug))
    .limit(1);

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
