import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { NewLinkForm } from "@/app/dashboard/new/NewLinkForm";
import { config } from "@/lib/config";
import { db } from "@/lib/db";
import { detectPlatform } from "@/lib/platform";
import { userLinks } from "@/lib/schema";

type CreateLinkState =
  | { ok: false; error: string; permalink?: string; slug?: string }
  | { ok: true; error?: string; permalink: string; slug: string };

function normalizeSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isValidSlug(slug: string): boolean {
  // 3-32 chars, lowercase letters/numbers, hyphen-separated tokens.
  return (
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) &&
    slug.length >= 3 &&
    slug.length <= 32
  );
}

function dbErrorToUserMessage(err: unknown, slug: string): string {
  const e = err as { code?: string; message?: string; cause?: unknown };
  const message = String(e?.message ?? "");
  const causeMessage =
    e?.cause && typeof e.cause === "object" && "message" in e.cause
      ? String((e.cause as { message?: unknown }).message ?? "")
      : "";
  const combined = `${message}\n${causeMessage}`.toLowerCase();

  // Postgres unique violation
  if (
    e?.code === "23505" ||
    combined.includes("duplicate key value") ||
    combined.includes("unique constraint") ||
    combined.includes("user_links_slug_unique")
  ) {
    return `That slug is already taken: "${slug}". Try another (e.g. "${slug}-2").`;
  }

  // Missing table / migrations not applied
  if (
    e?.code === "42P01" ||
    combined.includes('relation "user_links" does not exist') ||
    combined.includes("does not exist") ||
    combined.includes("undefined_table")
  ) {
    return "Your database isn't initialized yet (missing table `user_links`). Run your Drizzle migrations, then try again.";
  }

  // Connectivity / env issues
  if (
    combined.includes("fetch failed") ||
    combined.includes("ecconn") ||
    combined.includes("econn") ||
    combined.includes("timeout") ||
    combined.includes("could not parse the http request body")
  ) {
    return "Couldn’t reach the database. Double-check `DATABASE_URL` and that Neon is reachable, then try again.";
  }

  return "Could not create permalink due to a server error. Please try again in a moment.";
}

export default function NewLinkPage() {
  async function createPermalink(
    _prevState: CreateLinkState,
    formData: FormData,
  ): Promise<CreateLinkState> {
    "use server";

    const { userId } = await auth();
    if (!userId) {
      redirect("/");
    }

    const rawAppId = String(formData.get("appId") ?? "").trim();
    const rawSlug = String(formData.get("slug") ?? "").trim();

    const platform = detectPlatform(rawAppId);
    if (platform !== "ios") {
      return {
        ok: false,
        error:
          "Please enter a valid iOS App Store ID (it should look like id284882215).",
      };
    }

    const slug = normalizeSlug(rawSlug);
    if (!isValidSlug(slug)) {
      return {
        ok: false,
        error:
          "Slug must be 3–32 chars and use only lowercase letters, numbers, and hyphens (e.g. spotify or my-app).",
      };
    }

    // Fast pre-check to give a friendly error before we hit the unique index.
    let existing: Array<{ slug: string }> = [];
    try {
      existing = await db
        .select({ slug: userLinks.slug })
        .from(userLinks)
        .where(eq(userLinks.slug, slug))
        .limit(1);
    } catch (err) {
      return { ok: false, error: dbErrorToUserMessage(err, slug) };
    }

    if (existing.length > 0) {
      return {
        ok: false,
        error: `That slug is already taken: "${slug}". Try another.`,
      };
    }

    try {
      await db.insert(userLinks).values({
        slug,
        userId,
        appId: rawAppId,
        platform,
      });
    } catch (err) {
      if (config.enableDebugLogs) {
        console.error("createPermalink insert failed", { slug, userId, err });
      }
      return {
        ok: false,
        error: dbErrorToUserMessage(err, slug),
      };
    }

    return { ok: true, slug, permalink: `${config.siteUrl}/p/${slug}` };
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            New permalink
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Create a permanent RightFront link for an iOS App Store ID.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          ← Back
        </Link>
      </div>

      <NewLinkForm action={createPermalink} />
    </section>
  );
}
