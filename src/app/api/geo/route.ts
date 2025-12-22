import { NextRequest, NextResponse } from "next/server";

import { getCountryCode } from "@/lib/geo";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const country = await getCountryCode(req);
  const isDevDefaulted =
    country === (process.env.DEV_COUNTRY || "us").toLowerCase();

  return NextResponse.json({
    country,
    // Best-effort hint; in local dev we may just be defaulting.
    source: isDevDefaulted ? "default/dev" : "geo/headers",
  });
}
