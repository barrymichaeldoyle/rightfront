import { NextRequest } from "next/server";

import { eq } from "drizzle-orm";

import { config } from "@/lib/config";
import { db } from "@/lib/db";
import { getCountryCode } from "@/lib/geo";
import { getLanguageCodeFromAcceptLanguage } from "@/lib/lang";
import { detectPlatform } from "@/lib/platform";
import { resolveAppUrl } from "@/lib/resolve";
import { linkEvents, userLinks } from "@/lib/schema";
import { hashIP } from "@/lib/utils/ipHash";

export const runtime = "edge"; // optional (for faster geo detection)

function getClientIp(req: NextRequest): string | null {
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;

  const forwardedFor = req.headers.get("x-forwarded-for");
  if (!forwardedFor) return null;
  return forwardedFor.split(",")[0]?.trim() || null;
}

function parseUserAgent(userAgent: string | null): {
  deviceType: string | null;
  os: string | null;
  browser: string | null;
} {
  const ua = (userAgent ?? "").toLowerCase();
  if (!ua) return { deviceType: null, os: null, browser: null };

  const deviceType =
    ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")
      ? "ios"
      : ua.includes("android")
        ? "android"
        : ua.includes("mobile")
          ? "mobile"
          : ua.includes("windows") ||
              ua.includes("macintosh") ||
              ua.includes("linux")
            ? "desktop"
            : "unknown";

  const os =
    ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")
      ? "iOS"
      : ua.includes("android")
        ? "Android"
        : ua.includes("windows nt")
          ? "Windows"
          : ua.includes("mac os x") || ua.includes("macintosh")
            ? "macOS"
            : ua.includes("linux")
              ? "Linux"
              : null;

  // Order matters: Chrome UA includes "safari"
  const browser = ua.includes("edg/")
    ? "Edge"
    : ua.includes("chrome/")
      ? "Chrome"
      : ua.includes("safari/")
        ? "Safari"
        : ua.includes("firefox/")
          ? "Firefox"
          : null;

  return { deviceType, os, browser };
}

export async function GET(req: NextRequest) {
  const crawlHeaders = {
    // Prevent indexing of utility redirect URLs (avoids duplicate crawl / indexing).
    "X-Robots-Tag": "noindex, nofollow, noarchive",
    // Redirect destination can vary by geo/availability, so avoid caching.
    "Cache-Control": "no-store",
  } as const;

  const appId = req.nextUrl.searchParams.get("id");
  const slug = req.nextUrl.searchParams.get("slug");

  if (!appId) {
    return new Response("Missing app id", {
      status: 400,
      headers: crawlHeaders,
    });
  }

  const store = detectPlatform(appId);
  if (!store) {
    return new Response("Invalid app ID format", {
      status: 400,
      headers: crawlHeaders,
    });
  }

  const country = (await getCountryCode(req)) || config.defaultCountry;
  const resolvedUrl = await resolveAppUrl(
    store === "android"
      ? {
          appId,
          store,
          country,
          language: getLanguageCodeFromAcceptLanguage(
            req.headers.get("accept-language"),
          ),
        }
      : { appId, store, country },
  );

  const fallbackUrl = `${req.nextUrl.origin}${config.fallbackUrlBase}?id=${appId}&country=${country}`;

  if (config.enableDebugLogs) {
    console.log("Fallback URL:", fallbackUrl);
  }

  // ---- Analytics (best-effort; should never block the redirect) ----
  try {
    if (slug) {
      const rows = await db
        .select({
          id: userLinks.id,
          userId: userLinks.userId,
          appId: userLinks.appId,
        })
        .from(userLinks)
        .where(eq(userLinks.slug, slug))
        .limit(1);

      const link = rows[0];
      if (link) {
        const headersList = req.headers;
        const userAgent = headersList.get("user-agent");
        const { deviceType, os, browser } = parseUserAgent(userAgent);

        const targetUrl = resolvedUrl ?? fallbackUrl;
        const usedFallback = !resolvedUrl;

        // Currently we only resolve country (region/city are best-effort nulls).
        const region: string | null = null;
        const city: string | null = null;

        await db.insert(linkEvents).values({
          linkId: link.id,
          userId: link.userId,
          appId: link.appId,
          ipHash: await hashIP(getClientIp(req)),
          country,
          region,
          city,
          userAgent: userAgent || null,
          referrer: headersList.get("referer") || null,
          deviceType,
          os,
          browser,
          platformDetected: store,
          routedStorefront: targetUrl,
          storeRegion: country,
          usedFallback,
          fallbackReason: usedFallback ? "unavailable" : null,
          success: true,
        });
      }
    }
  } catch (err) {
    if (config.enableDebugLogs) {
      console.warn("linkEvents insert failed (ignored)", err);
    }
  }

  if (resolvedUrl) {
    return new Response(null, {
      status: 302,
      headers: {
        ...crawlHeaders,
        Location: resolvedUrl,
      },
    });
  }

  return new Response(null, {
    status: 302,
    headers: {
      ...crawlHeaders,
      Location: fallbackUrl,
    },
  });
}
