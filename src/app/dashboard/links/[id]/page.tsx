import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

import { config } from "@/lib/config";
import { db } from "@/lib/db";
import { dbErrorToUserMessage } from "@/lib/dbErrors";
import type { UpdateLinkState } from "@/lib/linkStates";
import { detectPlatform } from "@/lib/platform";
import { userLinks } from "@/lib/schema";
import { isValidSlug, normalizeSlug } from "@/lib/slug";

import { LinkSettingsForm } from "./LinkSettingsForm";

export default async function LinkSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const { id } = await params;

  const rows = await db
    .select({
      id: userLinks.id,
      slug: userLinks.slug,
      appId: userLinks.appId,
      platform: userLinks.platform,
      clicks: userLinks.clicks,
      createdAt: userLinks.createdAt,
      updatedAt: userLinks.updatedAt,
    })
    .from(userLinks)
    .where(and(eq(userLinks.id, id), eq(userLinks.userId, userId)))
    .limit(1);

  const link = rows[0];
  if (!link) {
    redirect("/dashboard");
  }

  async function updateLink(
    _prevState: UpdateLinkState,
    formData: FormData,
  ): Promise<UpdateLinkState> {
    "use server";

    const { userId: actionUserId } = await auth();
    if (!actionUserId) {
      redirect("/");
    }

    const linkId = String(formData.get("id") ?? "").trim();
    if (!linkId) {
      return { ok: false, error: "Missing link id." };
    }

    const rawAppId = String(formData.get("appId") ?? "").trim();
    const rawSlug = String(formData.get("slug") ?? "").trim();

    const platform = detectPlatform(rawAppId);
    if (!platform) {
      return {
        ok: false,
        error:
          "Please enter a valid App ID (iOS: id123… or Android: com.example.app).",
      };
    }

    const nextSlug = normalizeSlug(rawSlug);
    if (!isValidSlug(nextSlug)) {
      return {
        ok: false,
        error:
          "Slug must be 3–32 chars and use only lowercase letters, numbers, and hyphens (e.g. spotify or my-app).",
      };
    }

    try {
      await db
        .update(userLinks)
        .set({
          slug: nextSlug,
          appId: rawAppId,
          platform,
          updatedAt: new Date(),
        })
        .where(
          and(eq(userLinks.id, linkId), eq(userLinks.userId, actionUserId)),
        );
    } catch (err) {
      return {
        ok: false,
        error: dbErrorToUserMessage(err, nextSlug, "save_changes"),
      };
    }

    return { ok: true, permalink: `${config.siteUrl}/p/${nextSlug}` };
  }

  async function deleteLink(formData: FormData) {
    "use server";

    const { userId: actionUserId } = await auth();
    if (!actionUserId) {
      redirect("/");
    }

    const linkId = String(formData.get("id") ?? "").trim();
    if (!linkId) return;

    await db
      .delete(userLinks)
      .where(and(eq(userLinks.id, linkId), eq(userLinks.userId, actionUserId)));

    redirect("/dashboard");
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Link settings
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage{" "}
            <span className="font-mono text-slate-300">/p/{link.slug}</span>
          </p>
        </div>
        <Link
          href="/dashboard"
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          ← Back
        </Link>
      </div>

      <LinkSettingsForm
        linkId={link.id}
        initialSlug={link.slug}
        initialAppId={link.appId}
        initialPlatform={link.platform}
        siteUrl={config.siteUrl}
        updateAction={updateLink}
        deleteAction={deleteLink}
      />
    </section>
  );
}
