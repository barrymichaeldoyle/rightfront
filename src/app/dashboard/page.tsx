import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";

import { config } from "@/lib/config";
import { db } from "@/lib/db";
import { userLinks } from "@/lib/schema";

import { DashboardLinksClient } from "./DashboardLinksClient";

function formatDate(d: Date | null): string {
  if (!d) return "—";
  // simple, stable YYYY-MM-DD
  return d.toISOString().slice(0, 10);
}

function isMissingUserLinksTable(err: unknown): boolean {
  const e = err as { code?: string; message?: string; cause?: unknown };
  if (e?.code === "42P01") return true; // undefined_table
  const msg = String(e?.message ?? "");
  const causeMsg =
    e?.cause && typeof e.cause === "object" && "message" in e.cause
      ? String((e.cause as { message?: unknown }).message ?? "")
      : "";
  const combined = `${msg}\n${causeMsg}`.toLowerCase();
  return combined.includes('relation "user_links" does not exist');
}

export default async function DashboardHomePage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const { links, dbNotInitialized } = await (async (): Promise<{
    links: Array<{
      id: string;
      slug: string;
      appId: string;
      platform: string;
      clicks: number | null;
      createdAt: Date | null;
    }>;
    dbNotInitialized: boolean;
  }> => {
    try {
      const links = await db
        .select({
          id: userLinks.id,
          slug: userLinks.slug,
          appId: userLinks.appId,
          platform: userLinks.platform,
          clicks: userLinks.clicks,
          createdAt: userLinks.createdAt,
        })
        .from(userLinks)
        .where(eq(userLinks.userId, userId))
        .orderBy(desc(userLinks.createdAt));
      return { links, dbNotInitialized: false };
    } catch (err) {
      if (isMissingUserLinksTable(err)) {
        return { links: [], dbNotInitialized: true };
      }
      throw err;
    }
  })();

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Links</h1>
          <p className="mt-1 text-sm text-slate-400">
            Your saved permalinks and recent performance.
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="rounded-md bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-sky-400 hover:to-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          + New Link
        </Link>
      </div>

      {dbNotInitialized ? (
        <div className="mb-4 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-5 text-sm text-amber-200">
          Your production database doesn&apos;t have the{" "}
          <span className="font-mono text-amber-100">user_links</span> table
          yet. Run your Drizzle migrations against prod{" "}
          <span className="font-mono text-amber-100">DATABASE_URL</span>, then
          refresh.
        </div>
      ) : null}

      {links.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6">
          <p className="text-sm text-slate-300">
            You don&apos;t have any permalinks yet.
          </p>
          <Link
            href="/dashboard/new"
            className="mt-4 inline-flex rounded-md bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-sky-400 hover:to-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Create your first permalink
          </Link>
        </div>
      ) : (
        <DashboardLinksClient
          siteUrl={config.siteUrl}
          links={links.map((l) => ({
            id: l.id,
            slug: l.slug,
            appId: l.appId,
            platform: l.platform,
            clicks: l.clicks ?? 0,
            createdAt: formatDate(l.createdAt ?? null),
          }))}
        />
      )}
    </section>
  );
}
