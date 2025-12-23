import "dotenv/config";

import { neon } from "@neondatabase/serverless";
import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

import { linkEvents, userLinks } from "@/lib/schema";
import { hashIP } from "@/lib/utils/ipHash";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL in environment.");
}

// NOTE: We intentionally do NOT import `src/lib/db.ts` here because it includes
// `server-only`, which is meant for Next.js Server Components, not Node scripts.
const sqlClient = neon(databaseUrl);
const db = drizzle(sqlClient);

function envInt(key: string, fallback: number): number {
  const raw = String(process.env[key] ?? "").trim();
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function envBool(key: string, fallback = false): boolean {
  const raw = String(process.env[key] ?? "")
    .trim()
    .toLowerCase();
  if (!raw) return fallback;
  return raw === "1" || raw === "true" || raw === "yes";
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function startOfDayUTC(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
}

function daysAgoUtc(days: number): Date {
  const start = startOfDayUTC(new Date());
  start.setUTCDate(start.getUTCDate() - days);
  return start;
}

function randomDateBetween(from: Date, to: Date): Date {
  const a = from.getTime();
  const b = to.getTime();
  const t = a + Math.floor(Math.random() * Math.max(1, b - a));
  return new Date(t);
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function main() {
  const userId = String(process.env.SEED_USER_ID ?? "").trim() || "seed_user";
  const appIdBase = String(process.env.SEED_APP_ID_BASE ?? "").trim();

  const linksCount = envInt("SEED_LINKS", 3);
  const eventsPerLink = envInt("SEED_EVENTS_PER_LINK", 250);
  const days = envInt("SEED_DAYS", 30);
  const wipeExistingForUser = envBool("SEED_WIPE_USER", false);

  const now = new Date();
  const from = daysAgoUtc(days);

  // Some plausible distributions
  const countries = [
    "us",
    "gb",
    "ca",
    "de",
    "fr",
    "nl",
    "au",
    "br",
    "mx",
    "jp",
    "in",
  ] as const;

  const referrers = [
    null,
    "https://google.com/",
    "https://twitter.com/",
    "https://x.com/",
    "https://t.co/abc123",
    "https://news.ycombinator.com/",
    "https://www.reddit.com/",
    "https://producthunt.com/",
    "https://tiktok.com/",
    "https://instagram.com/",
    "https://mail.google.com/",
    "https://substack.com/",
    "https://github.com/",
    "https://www.linkedin.com/",
  ] as const;

  const deviceCombos = [
    { deviceType: "ios", os: "iOS", browser: "Safari" },
    { deviceType: "ios", os: "iOS", browser: "Chrome" },
    { deviceType: "android", os: "Android", browser: "Chrome" },
    { deviceType: "android", os: "Android", browser: "Firefox" },
    { deviceType: "desktop", os: "macOS", browser: "Safari" },
    { deviceType: "desktop", os: "Windows", browser: "Chrome" },
    { deviceType: "desktop", os: "Windows", browser: "Edge" },
  ] as const;

  const platformsDetected = ["ios", "android"] as const;

  // Optional cleanup: only removes data for this user (safer than truncating tables).
  if (wipeExistingForUser) {
    console.log(`Wiping existing seed data for userId=${userId}...`);
    const links = await db
      .select({ id: userLinks.id })
      .from(userLinks)
      .where(eq(userLinks.userId, userId));

    const linkIds = links.map((l) => l.id);
    if (linkIds.length > 0) {
      // delete link events first (no FK in schema, but keep ordering sane)
      await db.delete(linkEvents).where(eq(linkEvents.userId, userId));
      await db.delete(userLinks).where(eq(userLinks.userId, userId));
    }
  }

  const runTag =
    String(process.env.SEED_TAG ?? "").trim() || String(Date.now());

  // Create links (platform is required; we use well-formed IDs)
  const linkSeeds = Array.from({ length: linksCount }, (_, i) => {
    const isAndroid = i % 2 === 1;
    const appId = appIdBase
      ? `${appIdBase}${isAndroid ? `.android${i + 1}` : `.ios${i + 1}`}`
      : isAndroid
        ? `com.example.rightfront.seed${i + 1}`
        : `id${String(1000000000 + i)}`;

    return {
      userId,
      appId,
      platform: isAndroid ? "android" : "ios",
      slug: `seed-${runTag}-${i + 1}`,
      clicks: eventsPerLink, // keep the list page looking "alive"
      updatedAt: now,
      createdAt: now,
    };
  });

  console.log(`Creating ${linksCount} links for userId=${userId}...`);
  const createdLinks = await db.insert(userLinks).values(linkSeeds).returning({
    id: userLinks.id,
    slug: userLinks.slug,
    appId: userLinks.appId,
    platform: userLinks.platform,
    userId: userLinks.userId,
  });

  console.log("Created links:");
  for (const l of createdLinks) {
    console.log(`- ${l.id}  /p/${l.slug}  (${l.platform} ${l.appId})`);
  }

  console.log(
    `Creating ~${eventsPerLink * createdLinks.length} link_events over last ${days} days...`,
  );

  const events: Array<typeof linkEvents.$inferInsert> = [];
  for (const link of createdLinks) {
    for (let i = 0; i < eventsPerLink; i++) {
      const country = pick(countries);
      const referrer = pick(referrers);
      const combo = pick(deviceCombos);

      const usedFallback = Math.random() < 0.12;
      const platformDetected = pick(platformsDetected);

      const createdAt = randomDateBetween(from, now);

      // "visitor id" simulation: 40% returning users, 60% one-offs.
      const visitorKey =
        Math.random() < 0.4
          ? `returning-${Math.floor(Math.random() * 40)}`
          : `oneoff-${link.slug}-${i}-${Math.floor(Math.random() * 100000)}`;

      const ipHash = await hashIP(visitorKey);

      const routedStorefront = usedFallback
        ? `https://rightfront.app/fallback?id=${encodeURIComponent(link.appId)}&country=${country}`
        : platformDetected === "android"
          ? `https://play.google.com/store/apps/details?id=${encodeURIComponent(link.appId)}`
          : `https://apps.apple.com/${country}/app/id${encodeURIComponent(link.appId.replace(/^id/, ""))}`;

      events.push({
        linkId: link.id,
        userId: link.userId,
        appId: link.appId,
        ipHash,
        country,
        region: null,
        city: null,
        userAgent: null,
        referrer: referrer ?? null,
        deviceType: combo.deviceType,
        os: combo.os,
        browser: combo.browser,
        platformDetected,
        routedStorefront,
        storeRegion: country,
        usedFallback,
        fallbackReason: usedFallback ? "unavailable" : null,
        success: true,
        createdAt,
      });
    }
  }

  // Insert in batches to avoid very large requests.
  const batches = chunk(events, envInt("SEED_BATCH_SIZE", 500));
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]!;
    await db.insert(linkEvents).values(batch);
    process.stdout.write(`Inserted batch ${i + 1}/${batches.length}\r`);
  }
  process.stdout.write("\n");

  // Optional: keep user_links.clicks aligned with event volume for this run
  await Promise.all(
    createdLinks.map((l) =>
      db
        .update(userLinks)
        .set({
          clicks: sql`${userLinks.clicks} + ${eventsPerLink}`,
          updatedAt: now,
        })
        .where(and(eq(userLinks.id, l.id), eq(userLinks.userId, userId))),
    ),
  );

  console.log("Done.");
  console.log(
    `Open your dashboard and navigate to one of the seeded links. If you want to reseed, re-run with SEED_WIPE_USER=true.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
