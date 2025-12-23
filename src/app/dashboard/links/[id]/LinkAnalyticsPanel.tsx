import "server-only";

import * as FLAG_BY_CC from "country-flag-icons/react/3x2";
import { and, desc, eq, gte, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { linkEvents } from "@/lib/schema";

import { RangeToggle } from "./RangeToggle";

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

function normalizeCountryCodeForFlag(code: string | null): string | null {
  const normalized = String(code ?? "")
    .trim()
    .toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) return null;
  // Common alias: humans type UK; ISO uses GB.
  return normalized === "UK" ? "GB" : normalized;
}

const REGION_DISPLAY_NAMES: Intl.DisplayNames | null =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

function countryNameFromCode(code: string | null): string {
  const cc = normalizeCountryCodeForFlag(code);
  if (!cc) return "Unknown";
  return REGION_DISPLAY_NAMES?.of(cc) ?? cc;
}

function FlagIcon({ code, className }: { code: string; className?: string }) {
  const cc = normalizeCountryCodeForFlag(code);
  if (!cc) return null;
  const Flag = FLAG_BY_CC[cc as keyof typeof FLAG_BY_CC];
  if (!Flag) return null;

  return (
    <span
      aria-hidden="true"
      className="inline-flex overflow-hidden rounded-sm bg-white/10 shadow-sm ring-1 shadow-black/30 ring-white/15"
    >
      <Flag className={className} />
    </span>
  );
}

function prettyDeviceType(v: unknown): string {
  const s = String(v ?? "")
    .trim()
    .toLowerCase();
  if (!s) return "Unknown";
  if (s === "ios") return "iOS";
  if (s === "android") return "Android";
  if (s === "desktop") return "Desktop";
  if (s === "mobile") return "Mobile";
  return s;
}

function prettyOs(v: unknown): string {
  const s = String(v ?? "").trim();
  if (!s) return "Unknown";
  if (s.toLowerCase() === "ios") return "iOS";
  return s;
}

function prettyBrowser(v: unknown): string {
  const s = String(v ?? "").trim();
  return s || "Unknown";
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20Zm0 4.75a1.25 1.25 0 1 1 0 2.5a1.25 1.25 0 0 1 0-2.5ZM13.25 17h-2.5v-1.5h.5V11h-.5V9.5h2v6h.5V17Z"
      />
    </svg>
  );
}

function toNum(v: unknown): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function nfmt(n: unknown): string {
  const v = toNum(n);
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
    const [
      totalsRow,
      topCountries,
      topReferrersRaw,
      topDeviceTypes,
      topOs,
      topBrowsers,
      dailyRows,
    ] = await Promise.all([
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
          count: sql<number>`count(*)`,
        })
        .from(linkEvents)
        .where(whereRange)
        .groupBy(linkEvents.deviceType)
        .orderBy(desc(sql<number>`count(*)`))
        .limit(6),
      db
        .select({
          os: linkEvents.os,
          count: sql<number>`count(*)`,
        })
        .from(linkEvents)
        .where(whereRange)
        .groupBy(linkEvents.os)
        .orderBy(desc(sql<number>`count(*)`))
        .limit(6),
      db
        .select({
          browser: linkEvents.browser,
          count: sql<number>`count(*)`,
        })
        .from(linkEvents)
        .where(whereRange)
        .groupBy(linkEvents.browser)
        .orderBy(desc(sql<number>`count(*)`))
        .limit(6),
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

    const total = toNum(totalsRow?.total);
    const uniques = toNum(totalsRow?.uniques);
    const fallback = toNum(totalsRow?.fallback);
    const fallbackRate = total > 0 ? fallback / total : NaN;
    const lastAt = totalsRow?.last ?? null;
    const topCountryCode = topCountries[0]?.country ?? null;
    const topCountryName = countryNameFromCode(topCountryCode);
    const topCountryCc = normalizeCountryCodeForFlag(topCountryCode);

    // Normalize referrers by host in JS so common UTM variants aggregate visually.
    const refAgg = new Map<string, number>();
    for (const r of topReferrersRaw) {
      refAgg.set(
        safeHost(r.referrer),
        (refAgg.get(safeHost(r.referrer)) ?? 0) + toNum(r.count),
      );
    }
    const topReferrers = Array.from(refAgg.entries())
      .map(([host, count]) => ({ host, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const dailyMap = new Map<string, number>();
    for (const row of dailyRows) {
      const key = startOfDayUTC(new Date(row.day)).toISOString().slice(0, 10);
      dailyMap.set(key, toNum(row.count));
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

            <RangeToggle current={range} />
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
                {topCountryCc ? (
                  <span className="inline-flex items-center gap-2">
                    <FlagIcon
                      code={topCountryCc}
                      className="h-5 w-7 object-cover"
                    />
                    <span className="truncate">{topCountryName}</span>
                  </span>
                ) : (
                  "—"
                )}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {topCountries[0]?.count ? (
                  <>
                    {topCountryCc ? (
                      <span className="font-mono text-slate-400">
                        {topCountryCc}
                      </span>
                    ) : null}
                    {topCountryCc ? <span> • </span> : null}
                    {nfmt(topCountries[0].count)} clicks
                  </>
                ) : (
                  "No data yet."
                )}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6">
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
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="grid gap-6">
              <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
                <p className="text-sm font-semibold text-slate-100">
                  Countries
                </p>
                <p className="mt-1 text-xs text-slate-400">Top locations</p>

                {topCountries.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-400">No data yet.</p>
                ) : (
                  <div className="mt-4 grid gap-2">
                    {topCountries.slice(0, 6).map((c, idx) => {
                      const cc = normalizeCountryCodeForFlag(c.country);
                      const name = countryNameFromCode(c.country);
                      return (
                        <div
                          key={`${c.country ?? "unknown"}-${idx}`}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            {cc ? (
                              <FlagIcon
                                code={cc}
                                className="h-4 w-6 object-cover"
                              />
                            ) : null}
                            <span className="min-w-0 truncate text-sm text-slate-200">
                              {name}
                            </span>
                            {cc ? (
                              <span className="shrink-0 font-mono text-xs text-slate-500">
                                {cc}
                              </span>
                            ) : null}
                          </span>
                          <span className="shrink-0 font-mono text-xs text-slate-400 tabular-nums">
                            {nfmt(c.count)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
                <p className="text-sm font-semibold text-slate-100">
                  Top sources
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                  <span>Referrer host</span>
                  <span className="group/info relative inline-flex">
                    <button
                      type="button"
                      aria-label="About referrer attribution"
                      className="inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded border border-slate-700/80 bg-slate-900/40 text-slate-300 transition hover:bg-slate-900 hover:text-slate-100 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
                    >
                      <InfoIcon className="h-3.5 w-3.5" />
                    </button>
                    <span className="pointer-events-none absolute top-0 left-1/2 z-10 w-[260px] -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded bg-slate-950 px-2.5 py-2 text-[11px] leading-snug text-slate-100 opacity-0 shadow-lg ring-1 ring-slate-800 transition-opacity group-focus-within/info:opacity-100 group-hover/info:opacity-100">
                      Best-effort attribution: some apps/browsers omit or mangle{" "}
                      <span className="font-mono">Referer</span>. We parse the
                      referrer URL and group by its host when available.
                    </span>
                  </span>
                </div>

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
                        <span className="shrink-0 font-mono text-xs text-slate-400 tabular-nums">
                          {nfmt(r.count)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">
                      Devices
                    </p>
                    <p className="mt-1 text-xs text-slate-400">Device type</p>
                  </div>
                  <div className="grid grid-cols-[48px_64px] gap-3 text-right text-[11px] font-semibold tracking-wide text-slate-500">
                    <span>SHARE</span>
                    <span>CLICKS</span>
                  </div>
                </div>

                {topDeviceTypes.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-400">No data yet.</p>
                ) : (
                  <div className="mt-4 grid gap-2">
                    {topDeviceTypes.map((d, idx) => {
                      const label = prettyDeviceType(d.deviceType);
                      const c = toNum(d.count);
                      const pct = total > 0 ? c / total : NaN;
                      return (
                        <div
                          key={`${label}-${idx}`}
                          className="grid grid-cols-[minmax(0,1fr)_48px_64px] items-center gap-3"
                        >
                          <span className="min-w-0 truncate text-sm text-slate-200">
                            {label}
                          </span>
                          <span className="text-right font-mono text-xs text-slate-400 tabular-nums">
                            {formatPct(pct)}
                          </span>
                          <span className="text-right font-mono text-xs text-slate-500 tabular-nums">
                            {nfmt(c)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">
                      Operating Systems
                    </p>
                    <p className="mt-1 text-xs text-slate-400">OS</p>
                  </div>
                  <div className="grid grid-cols-[48px_64px] gap-3 text-right text-[11px] font-semibold tracking-wide text-slate-500">
                    <span>SHARE</span>
                    <span>CLICKS</span>
                  </div>
                </div>

                {topOs.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-400">No data yet.</p>
                ) : (
                  <div className="mt-4 grid gap-2">
                    {topOs.map((o, idx) => {
                      const label = prettyOs(o.os);
                      const c = toNum(o.count);
                      const pct = total > 0 ? c / total : NaN;
                      return (
                        <div
                          key={`${label}-${idx}`}
                          className="grid grid-cols-[minmax(0,1fr)_48px_64px] items-center gap-3"
                        >
                          <span className="min-w-0 truncate text-sm text-slate-200">
                            {label}
                          </span>
                          <span className="text-right font-mono text-xs text-slate-400 tabular-nums">
                            {formatPct(pct)}
                          </span>
                          <span className="text-right font-mono text-xs text-slate-500 tabular-nums">
                            {nfmt(c)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">
                      Browsers
                    </p>
                    <p className="mt-1 text-xs text-slate-400">Browser</p>
                  </div>
                  <div className="grid grid-cols-[48px_64px] gap-3 text-right text-[11px] font-semibold tracking-wide text-slate-500">
                    <span>SHARE</span>
                    <span>CLICKS</span>
                  </div>
                </div>

                {topBrowsers.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-400">No data yet.</p>
                ) : (
                  <div className="mt-4 grid gap-2">
                    {topBrowsers.map((b, idx) => {
                      const label = prettyBrowser(b.browser);
                      const c = toNum(b.count);
                      const pct = total > 0 ? c / total : NaN;
                      return (
                        <div
                          key={`${label}-${idx}`}
                          className="grid grid-cols-[minmax(0,1fr)_48px_64px] items-center gap-3"
                        >
                          <span className="min-w-0 truncate text-sm text-slate-200">
                            {label}
                          </span>
                          <span className="text-right font-mono text-xs text-slate-400 tabular-nums">
                            {formatPct(pct)}
                          </span>
                          <span className="text-right font-mono text-xs text-slate-500 tabular-nums">
                            {nfmt(c)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
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
