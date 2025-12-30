import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from "next/server";

import { clerkMiddleware } from "@clerk/nextjs/server";

// WordPress-style bot probe detection
const blockedPatterns = [
  /^\/wp-admin/i,
  /^\/wordpress/i,
  /^\/wp-login/i,
  /^\/wp-content/i,
  /^\/wp-includes/i,
];

// In-memory edge-local counter
const ipMap = new Map<string, { count: number; last: number }>();
const RATE_LIMIT = 5; // requests per minute before slowdown
const clerk = clerkMiddleware();

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export default async function proxy(
  request: NextRequest,
  event: NextFetchEvent,
) {
  const { pathname } = request.nextUrl;

  // If not hitting WP-like paths, hand off to Clerk normally
  if (!blockedPatterns.some((p) => p.test(pathname))) {
    return clerk(request, event);
  }

  const clientIP =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const now = Date.now();
  const entry = ipMap.get(clientIP) || { count: 0, last: now };

  // Reset per minute
  if (now - entry.last > 60_000) {
    entry.count = 0;
    entry.last = now;
  }

  entry.count += 1;
  entry.last = now;
  ipMap.set(clientIP, entry);

  // Light random delay before reply
  const delay =
    entry.count <= RATE_LIMIT
      ? Math.random() * 1200 + 400
      : Math.random() * 2000 + 800;
  await sleep(delay);

  // ------------ 🔍 Tiny log ------------
  // Only log the first few hits per IP per minute to reduce noise
  if (entry.count <= 3) {
    console.log(
      `[bot-block] ${clientIP} → ${pathname} (count: ${entry.count})`,
    );
  }
  // -------------------------------------

  if (entry.count <= RATE_LIMIT) {
    return NextResponse.json(
      { error: "Not Found", status: 404 },
      { status: 404 },
    );
  }

  // Silent disconnect (no data)
  return new NextResponse(null, { status: 204 });
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
