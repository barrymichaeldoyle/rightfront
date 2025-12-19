import { NextRequest } from "next/server";

import { config } from "@/lib/config";
import { getCountryCode } from "@/lib/geo";
import { getLanguageCodeFromAcceptLanguage } from "@/lib/lang";
import { detectPlatform } from "@/lib/platform";
import { resolveAppUrl } from "@/lib/resolve";

export const runtime = "edge"; // optional (for faster geo detection)

export async function GET(req: NextRequest) {
  const crawlHeaders = {
    // Prevent indexing of utility redirect URLs (avoids duplicate crawl / indexing).
    "X-Robots-Tag": "noindex, nofollow, noarchive",
    // Redirect destination can vary by geo/availability, so avoid caching.
    "Cache-Control": "no-store",
  } as const;

  const appId = req.nextUrl.searchParams.get("id");

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

  if (resolvedUrl) {
    return new Response(null, {
      status: 302,
      headers: {
        ...crawlHeaders,
        Location: resolvedUrl,
      },
    });
  }

  const fallbackUrl = `${req.nextUrl.origin}${config.fallbackUrlBase}?id=${appId}&country=${country}`;

  if (config.enableDebugLogs) {
    console.log("Fallback URL:", fallbackUrl);
  }

  return new Response(null, {
    status: 302,
    headers: {
      ...crawlHeaders,
      Location: fallbackUrl,
    },
  });
}
