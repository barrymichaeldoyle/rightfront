import { NextResponse } from "next/server";

type ContinentKey =
  | "north-america"
  | "south-america"
  | "europe"
  | "asia"
  | "africa"
  | "oceania";

// Storefront lists (kept intentionally "top markets" to control request fan-out).
const NORTH_AMERICA: readonly string[] = ["us", "ca", "mx"];
const SOUTH_AMERICA: readonly string[] = ["br", "ar", "cl", "co", "pe"];
const EUROPE: readonly string[] = [
  "gb",
  "ie",
  "fr",
  "de",
  "nl",
  "be",
  "ch",
  "at",
  "it",
  "es",
  "pt",
  "se",
  "no",
  "dk",
  "fi",
  "pl",
  "cz",
  "hu",
  "ro",
  "gr",
];
const ASIA: readonly string[] = [
  "jp",
  "kr",
  "in",
  "cn",
  "hk",
  "sg",
  "tw",
  "th",
  "ph",
  "id",
  "my",
  "vn",
  "tr",
  "il",
  "ae",
  "sa",
];
const AFRICA: readonly string[] = ["za", "eg", "ng", "ke", "ma"];
const OCEANIA: readonly string[] = ["au", "nz"];

const GLOBAL_FALLBACK: readonly string[] = ["us", "gb", "de", "jp", "au"];

const CONTINENT_GROUPS: Record<ContinentKey, readonly string[]> = {
  "north-america": NORTH_AMERICA,
  "south-america": SOUTH_AMERICA,
  europe: EUROPE,
  asia: ASIA,
  africa: AFRICA,
  oceania: OCEANIA,
};

function normalizeStorefront(code: string | null): string | null {
  if (!code) return null;
  const cc = code.trim().toLowerCase();
  // Human alias: people type "uk", Apple uses "gb".
  return cc === "uk" ? "gb" : cc;
}

function continentForStorefront(cc: string): ContinentKey | null {
  for (const [continent, list] of Object.entries(CONTINENT_GROUPS) as Array<
    [ContinentKey, readonly string[]]
  >) {
    if (list.includes(cc)) return continent;
  }
  return null;
}

function uniq(list: readonly string[]): string[] {
  return [...new Set(list)];
}

function probeListForRequest(params: URLSearchParams): {
  scopeKey: string;
  probeCountries: string[];
} {
  const scope = params.get("scope"); // "all" | "continent" (default)
  const countryHint = normalizeStorefront(params.get("country"));

  if (scope === "all") {
    const all = uniq([
      ...NORTH_AMERICA,
      ...SOUTH_AMERICA,
      ...EUROPE,
      ...ASIA,
      ...AFRICA,
      ...OCEANIA,
    ]);
    return { scopeKey: "all", probeCountries: all };
  }

  const continent = countryHint ? continentForStorefront(countryHint) : null;
  const continentList = continent ? CONTINENT_GROUPS[continent] : [];
  const probeCountries = uniq([...continentList, ...GLOBAL_FALLBACK]);
  const scopeKey = continent ? `continent:${continent}` : "continent:unknown";

  return { scopeKey, probeCountries };
}

type AppleAppMeta = {
  trackId: number;
  name: string;
  developer: string;
  iconUrl: string | null;
  genre: string | null;
  price: string | null;
  rating: number | null;
  ratingCount: number | null;
  storeUrl: string | null;
  fetchedFromCountry: string;
};

// Simple in‑memory cache (persists while serverless function stays warm)
type CacheEntry = { ts: number; data: string[]; app: AppleAppMeta | null };
const cache = new Map<string, CacheEntry>();

const DAY_MS = 24 * 60 * 60 * 1000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const normalizedId = id.startsWith("id") ? id.slice(2) : id; // 👈 add this
  const { scopeKey, probeCountries } = probeListForRequest(searchParams);
  const cacheKey = `${id}|${scopeKey}`;
  const cached = cache.get(cacheKey);
  const now = Date.now();
  const refresh = searchParams.get("refresh") === "true";

  if (!refresh && cached && now - cached.ts < DAY_MS) {
    return NextResponse.json({
      id,
      available: cached.data,
      app: cached.app,
      scope: scopeKey,
      cached: true,
    });
  }

  const available: string[] = [];
  let app: AppleAppMeta | null = null;

  const checks = probeCountries.map(async (country) => {
    try {
      const res = await fetch(
        `https://itunes.apple.com/lookup?id=${normalizedId}&country=${country}`,
        { cache: "no-store" },
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data?.resultCount > 0) {
        available.push(country);

        if (!app) {
          const r = data?.results?.[0];
          if (r && typeof r.trackId === "number") {
            app = {
              trackId: r.trackId,
              name: r.trackName ?? "Unknown",
              developer: r.sellerName ?? "Unknown",
              iconUrl: r.artworkUrl100 ?? r.artworkUrl60 ?? null,
              genre: r.primaryGenreName ?? null,
              price: r.formattedPrice ?? null,
              rating:
                typeof r.averageUserRating === "number"
                  ? r.averageUserRating
                  : null,
              ratingCount:
                typeof r.userRatingCount === "number"
                  ? r.userRatingCount
                  : null,
              storeUrl: r.trackViewUrl ?? null,
              fetchedFromCountry: country,
            };
          }
        }
      }
    } catch {
      // ignore network errors
    }
  });

  await Promise.allSettled(checks);
  cache.set(cacheKey, { ts: now, data: available, app });

  return NextResponse.json({
    id,
    available,
    app,
    scope: scopeKey,
    cached: false,
  });
}
