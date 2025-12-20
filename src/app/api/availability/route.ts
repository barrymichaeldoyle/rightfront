import { NextResponse } from "next/server";

// Define store list
const APPLE_COUNTRIES: readonly string[] = [
  "us",
  "ca",
  "gb",
  "de",
  "fr",
  "br",
  "jp",
  "in",
  "au",
  "kr",
  "it",
  "es",
  "nl",
  "mx",
  "se",
  "pl",
  "ru",
  "cn",
  "hk",
  "sg",
];

// Simple in‑memory cache (persists while serverless function stays warm)
type CacheEntry = { ts: number; data: string[] };
const cache = new Map<string, CacheEntry>();

const DAY_MS = 24 * 60 * 60 * 1000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const normalizedId = id.startsWith("id") ? id.slice(2) : id; // 👈 add this
  const cached = cache.get(id);
  const now = Date.now();
  const refresh = searchParams.get("refresh") === "true";

  if (!refresh && cached && now - cached.ts < DAY_MS) {
    return NextResponse.json({ id, available: cached.data, cached: true });
  }

  const available: string[] = [];
  const checks = APPLE_COUNTRIES.map(async (country) => {
    try {
      const res = await fetch(
        `https://itunes.apple.com/lookup?id=${normalizedId}&country=${country}`,
        { cache: "no-store" },
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data?.resultCount > 0) available.push(country);
    } catch {
      // ignore network errors
    }
  });

  await Promise.allSettled(checks);
  cache.set(id, { ts: now, data: available });

  return NextResponse.json({ id, available, cached: false });
}
