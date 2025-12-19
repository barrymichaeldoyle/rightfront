import { NextRequest } from "next/server";

import { config } from "@/lib/config";
import { getCountryCode } from "@/lib/geo";
import { detectPlatform } from "@/lib/platform";
import { resolveAppUrl } from "@/lib/resolve";

export const runtime = "edge"; // optional (for faster geo detection)

export async function GET(req: NextRequest) {
  const appId = req.nextUrl.searchParams.get("id");

  if (!appId) {
    return new Response("Missing app id", { status: 400 });
  }

  const store = detectPlatform(appId);
  if (!store) {
    return new Response("Invalid app ID format", { status: 400 });
  }

  const country = (await getCountryCode(req)) || "us";
  const resolvedUrl = await resolveAppUrl({ appId, store, country });

  if (resolvedUrl) {
    return new Response(null, {
      status: 302,
      headers: {
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
      Location: fallbackUrl,
    },
  });
}
