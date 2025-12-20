"use client";

import { SVGProps } from "react";
import { useSearchParams } from "next/navigation";

import useSWR from "swr";

import { detectPlatform } from "@/lib/platform";

function ExternalLinkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </svg>
  );
}

const fetcher = (url: string) =>
  fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(r)));

export function FallbackClient() {
  const params = useSearchParams();
  const id = params.get("id")?.trim() || "";
  const country = params.get("country");

  const store = id ? detectPlatform(id) : null;
  const encodedId = encodeURIComponent(id);

  // SWR for Apple App Stores (must be called unconditionally to satisfy Hooks rules)
  const shouldFetch = store === "ios" && Boolean(id);
  const { data, isLoading, error } = useSWR(
    shouldFetch ? `/api/availability?id=${encodedId}` : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  const storeName = store === "ios" ? "App Store" : "Play Store";
  const usStoreUrl =
    store === "ios"
      ? `https://apps.apple.com/us/app/${encodedId}`
      : `https://play.google.com/store/apps/details?id=${encodedId}`;
  const genericStoreUrl =
    store === "ios"
      ? `https://apps.apple.com/app/${encodedId}`
      : `https://play.google.com/store/apps/details?id=${encodedId}`;

  const availableStores = data?.available ?? [];

  if (!id) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <h1 className="mb-4 text-3xl font-semibold">Invalid Link</h1>
        <p className="mb-6 max-w-lg text-gray-600">Missing app ID.</p>
      </main>
    );
  }

  if (!store) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <h1 className="mb-4 text-3xl font-semibold">Invalid App ID</h1>
        <p className="mb-6 max-w-lg text-gray-600">
          The app ID format is not recognized. Please use a valid iOS App Store
          ID (e.g., id284882215) or Android package name (e.g.,
          com.spotify.music).
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="mb-1 text-3xl font-semibold">App Not Available</h1>
      <p className="mb-2 max-w-lg text-gray-600">
        This app isn&apos;t available in your region (
        {country?.toUpperCase() || "Unknown"}). App availability is controlled
        by the store owner, not RightFront.
      </p>

      {/* Apple-only extra availability */}
      {store === "ios" && (
        <section className="mt-6">
          {isLoading && (
            <p className="animate-pulse text-sm text-gray-500">
              Checking available App Stores…
            </p>
          )}

          {!isLoading && availableStores.length > 0 && (
            <>
              <p className="mb-2 text-sm text-gray-500">Also available in:</p>
              <ul className="flex flex-wrap justify-center gap-2 text-sm text-blue-400">
                {availableStores.map((cc: string) => (
                  <li key={cc}>
                    <a
                      href={`https://apps.apple.com/${cc}/app/${encodedId}`}
                      className="underline hover:text-blue-300"
                    >
                      {cc.toUpperCase()} Store
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}

          {!isLoading && !error && availableStores.length === 0 && (
            <p className="text-sm text-gray-500">
              Couldn&apos;t find available App Stores for this app.
            </p>
          )}
        </section>
      )}
    </main>
  );
}
