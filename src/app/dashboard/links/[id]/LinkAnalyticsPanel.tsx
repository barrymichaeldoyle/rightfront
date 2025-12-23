import "server-only";

import { and, desc, eq, gte, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { linkEvents } from "@/lib/schema";

type RangeKey = "7d" | "30d" | "90d" | "all";

function parseRange(input: string | undefined): RangeKey {
  if (input === "7d" || input === "30d" || input === "90d" || input === "all") {
    return input;
  }
  return "30d";
}

function startOfDayUTC(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
}

function daysAgoUtc(days: number): Date {
  const now = new Date();
  const start = startOfDayUTC(now);
  start.setUTCDate(start.getUTCDate() - days);
  return start;
}

function formatPct(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return `${Math.round(n * 100)}%`;
}

function safeHost(referrer: string | null): string {
  if (!referrer) return "Direct / Unknown";
  try {
    return new URL(referrer).host || "Direct / Unknown";
  } catch {
    // Sometimes referrer can be garbage or just a host/path; still show something useful.
    const trimmed = referrer.trim();
    if (!trimmed) return "Direct / Unknown";
    return trimmed.length > 48 ? `${trimmed.slice(0, 48)}…` : trimmed;
  }
}

function prettyCountry(code: string | null): string {
  if (!code) return "Unknown";
  return code.toUpperCase();
}

function nfmt(n: number | null | undefined): string {
  const v = typeof n === "number" ? n : 0;
  return v.toLocaleString();
}

function isMissingLinkEventsTable(err: unknown): boolean {
  const e = err as { code?: string; message?: string; cause?: unknown };
  if (e?.code === "42P01") return true; // undefined_table
  const msg = String(e?.message ?? "");
  const causeMsg =
    e?.cause && typeof e.cause === "object" && "message" in e.cause
      ? String((e.cause as { message?: unknown }).message ?? "")
      : "";
  const combined = `${msg}\n${causeMsg}`.toLowerCase();
  return combined.includes('relation "link_events" does not exist');
}

export async function LinkAnalyticsPanel({
  userId,
  linkId,
  clicksCounter,
  range: rangeInput,
}: {
  userId: string;
  linkId: string;
  clicksCounter: number;
  range?: string;
}) {
  const range = parseRange(rangeInput);
  const fromDate =
    range === "all"
      ? null
      : range === "7d"
        ? daysAgoUtc(7)
        : range === "90d"
          ? daysAgoUtc(90)
          : daysAgoUtc(30);

  const whereBase = and(
    eq(linkEvents.userId, userId),
    eq(linkEvents.linkId, linkId),
  );
  const whereRange = fromDate
    ? and(whereBase, gte(linkEvents.createdAt, fromDate))
    : whereBase;

  const daysForChart =
    range === "7d" ? 7 : range === "90d" ? 90 : range === "all" ? 30 : 30;
  const chartFrom = daysAgoUtc(daysForChart);

  try {
    const [totalsRow, topCountries, topReferrersRaw, topDevices, dailyRows] =
      await Promise.all([
        db
          .select({
            total: sql<number>`count(*)`,
            uniques: sql<number>`count(distinct ${linkEvents.ipHash})`,
            fallback: sql<number>`sum(case when ${linkEvents.usedFallback} then 1 else 0 end)`,
            last: sql<Date | null>`max(${linkEvents.createdAt})`,
          })
          .from(linkEvents)
          .where(whereRange)
          .limit(1)
          .then((r) => r[0]),
        db
          .select({
            country: linkEvents.country,
            count: sql<number>`count(*)`,
          })
          .from(linkEvents)
          .where(whereRange)
          .groupBy(linkEvents.country)
          .orderBy(desc(sql<number>`count(*)`))
          .limit(6),
        db
          .select({
            referrer: linkEvents.referrer,
            count: sql<number>`count(*)`,
          })
          .from(linkEvents)
          .where(whereRange)
          .groupBy(linkEvents.referrer)
          .orderBy(desc(sql<number>`count(*)`))
          .limit(8),
        db
          .select({
            deviceType: linkEvents.deviceType,
            os: linkEvents.os,
            browser: linkEvents.browser,
            count: sql<number>`count(*)`,
          })
          .from(linkEvents)
          .where(whereRange)
          .groupBy(linkEvents.deviceType, linkEvents.os, linkEvents.browser)
          .orderBy(desc(sql<number>`count(*)`))
          .limit(8),
        db
          .select({
            day: sql<Date>`date_trunc('day', ${linkEvents.createdAt})`,
            count: sql<number>`count(*)`,
          })
          .from(linkEvents)
          .where(and(whereBase, gte(linkEvents.createdAt, chartFrom)))
          .groupBy(sql`date_trunc('day', ${linkEvents.createdAt})`)
          .orderBy(sql`date_trunc('day', ${linkEvents.createdAt})`),
      ]);

    const total = totalsRow?.total ?? 0;
    const uniques = totalsRow?.uniques ?? 0;
    const fallback = totalsRow?.fallback ?? 0;
    const fallbackRate = total > 0 ? fallback / total : NaN;
    const lastAt = totalsRow?.last ?? null;

    // Normalize referrers by host in JS so common UTM variants aggregate visually.
    const refAgg = new Map<string, number>();
    for (const r of topReferrersRaw) {
      refAgg.set(
        safeHost(r.referrer),
        (refAgg.get(safeHost(r.referrer)) ?? 0) + (r.count ?? 0),
      );
    }
    const topReferrers = Array.from(refAgg.entries())
      .map(([host, count]) => ({ host, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const dailyMap = new Map<string, number>();
    for (const row of dailyRows) {
      const key = startOfDayUTC(new Date(row.day)).toISOString().slice(0, 10);
      dailyMap.set(key, row.count ?? 0);
    }
    const series: Array<{ date: string; count: number }> = [];
    for (let i = daysForChart - 1; i >= 0; i--) {
      const d = daysAgoUtc(i);
      const key = d.toISOString().slice(0, 10);
      series.push({ date: key, count: dailyMap.get(key) ?? 0 });
    }
    const maxCount = Math.max(1, ...series.map((s) => s.count));

    const rangeLabel =
      range === "all"
        ? "All-time"
        : range === "7d"
          ? "Last 7 days"
          : range === "90d"
            ? "Last 90 days"
            : "Last 30 days";

    return (
      <section className="grid gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-100">Insights</p>
              <p className="mt-1 text-xs text-slate-400">
                {rangeLabel}
                {lastAt ? (
                  <>
                    {" "}
                    • Last click:{" "}
                    <span className="font-mono text-slate-300">
                      {new Date(lastAt)
                        .toISOString()
                        .replace("T", " ")
                        .slice(0, 16)}
                      Z
                    </span>
                  </>
                ) : null}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(["7d", "30d", "90d", "all"] as const).map((k) => {
                const active = k === range;
                return (
                  <a
                    key={k}
                    href={`?range=${k}`}
                    className={
                      active
                        ? "rounded-md border border-sky-400/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-200"
                        : "rounded-md border border-slate-700 bg-slate-950/40 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-900/40"
                    }
                  >
                    {k === "all" ? "All" : k}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
              <p className="text-xs font-medium text-slate-400">
                Tracked clicks
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-100">
                {nfmt(total)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Counter:{" "}
                <span className="font-mono text-slate-300">
                  {nfmt(clicksCounter)}
                </span>
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
              <p className="text-xs font-medium text-slate-400">
                Unique visitors
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-100">
                {nfmt(uniques)}
              </p>
              <p className="mt-1 text-xs text-slate-500">Based on hashed IP.</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
              <p className="text-xs font-medium text-slate-400">
                Fallback rate
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-100">
                {formatPct(fallbackRate)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {nfmt(fallback)} / {nfmt(total)} clicks used fallback.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
              <p className="text-xs font-medium text-slate-400">Top country</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-100">
                {topCountries[0]?.country
                  ? prettyCountry(topCountries[0].country)
                  : "—"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {topCountries[0]?.count
                  ? `${nfmt(topCountries[0].count)} clicks`
                  : "No data yet."}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
              <p className="text-sm font-semibold text-slate-100">
                Daily clicks
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Last {daysForChart} days (UTC)
              </p>

              <div className="mt-4 flex h-20 items-end gap-1">
                {series.map((s) => {
                  const h = Math.max(2, Math.round((s.count / maxCount) * 80));
                  return (
                    <div key={s.date} className="group relative flex-1">
                      <div
                        className="w-full rounded bg-sky-500/40 group-hover:bg-sky-400/70"
                        style={{ height: `${h}px` }}
                        title={`${s.date}: ${s.count}`}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>{series[0]?.date}</span>
                <span>{series.at(-1)?.date}</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
              <p className="text-sm font-semibold text-slate-100">
                Top sources
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Referrer host (best-effort)
              </p>

              {topReferrers.length === 0 ? (
                <p className="mt-4 text-sm text-slate-400">No data yet.</p>
              ) : (
                <div className="mt-4 grid gap-2">
                  {topReferrers.map((r) => (
                    <div
                      key={r.host}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="truncate text-sm text-slate-200">
                        {r.host}
                      </span>
                      <span className="shrink-0 font-mono text-xs text-slate-400">
                        {nfmt(r.count)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
              <p className="text-sm font-semibold text-slate-100">Countries</p>
              <p className="mt-1 text-xs text-slate-400">Top locations</p>

              {topCountries.length === 0 ? (
                <p className="mt-4 text-sm text-slate-400">No data yet.</p>
              ) : (
                <div className="mt-4 grid gap-2">
                  {topCountries.slice(0, 6).map((c) => (
                    <div
                      key={c.country ?? "unknown"}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="truncate text-sm text-slate-200">
                        {prettyCountry(c.country)}
                      </span>
                      <span className="shrink-0 font-mono text-xs text-slate-400">
                        {nfmt(c.count)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
              <p className="text-sm font-semibold text-slate-100">Devices</p>
              <p className="mt-1 text-xs text-slate-400">
                Device / OS / browser
              </p>

              {topDevices.length === 0 ? (
                <p className="mt-4 text-sm text-slate-400">No data yet.</p>
              ) : (
                <div className="mt-4 grid gap-2">
                  {topDevices.map((d, idx) => (
                    <div
                      key={`${d.deviceType}-${d.os}-${d.browser}-${idx}`}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="truncate text-sm text-slate-200">
                        {(d.deviceType || "unknown").toString()} •{" "}
                        {(d.os || "unknown").toString()} •{" "}
                        {(d.browser || "unknown").toString()}
                      </span>
                      <span className="shrink-0 font-mono text-xs text-slate-400">
                        {nfmt(d.count)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  } catch (err) {
    if (isMissingLinkEventsTable(err)) {
      return (
        <section className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-5 text-sm text-amber-200">
          Your database doesn&apos;t have the{" "}
          <span className="font-mono text-amber-100">link_events</span> table
          yet. Run your Drizzle migrations against{" "}
          <span className="font-mono text-amber-100">DATABASE_URL</span>, then
          refresh.
        </section>
      );
    }
    throw err;
  }
}
