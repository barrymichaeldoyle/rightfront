"use client";

import { ReactElement } from "react";
import { useSearchParams } from "next/navigation";

import * as FLAG_BY_CC from "country-flag-icons/react/3x2";
import useSWR from "swr";

import { detectPlatform } from "@/lib/platform";

const fetcher = (url: string) =>
  fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(r)));

function AppStoreIcon({ className }: { className?: string }): ReactElement {
  // Simple Apple-like glyph; keeps us dependency-free and style-consistent.
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        fill="currentColor"
        d="M16.78 13.44c.02 2.21 1.95 2.94 1.97 2.95-.01.05-.31 1.07-1.02 2.12-.61.91-1.25 1.82-2.25 1.84-.98.02-1.29-.57-2.41-.57-1.12 0-1.46.55-2.39.59-.96.04-1.7-.99-2.32-1.9-1.26-1.84-2.23-5.2-.93-7.48.65-1.13 1.8-1.84 3.05-1.86.95-.02 1.84.63 2.41.63.57 0 1.64-.78 2.76-.67.47.02 1.8.19 2.66 1.44-.07.04-1.59.93-1.53 2.91ZM14.98 5.73c.51-.62.85-1.48.76-2.33-.73.03-1.61.49-2.13 1.11-.47.55-.88 1.44-.77 2.29.81.06 1.63-.41 2.14-1.07Z"
      />
    </svg>
  );
}

function normalizeCountryCodeForFlag(code: string): string {
  const normalized = code.trim().toUpperCase();
  // Common alias: Apple uses "GB" while humans often type "UK".
  return normalized === "UK" ? "GB" : normalized;
}

const REGION_DISPLAY_NAMES: Intl.DisplayNames | null =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (Intl as any).DisplayNames(["en"], { type: "region" })
    : null;

function appStoreRegionLabel(code: string): string {
  const cc = normalizeCountryCodeForFlag(code);
  const name =
    REGION_DISPLAY_NAMES?.of(cc) ??
    // Fall back to the raw code if the runtime doesn't support Intl.DisplayNames.
    cc;
  return `${name} (${cc})`;
}

function FlagIcon({ code, className }: { code: string; className?: string }) {
  const cc = normalizeCountryCodeForFlag(code);
  const Flag = FLAG_BY_CC[cc as keyof typeof FLAG_BY_CC];
  if (!Flag) return null;

  return (
    <span
      aria-hidden="true"
      className="inline-flex overflow-hidden rounded-sm bg-white/10 shadow-sm ring-1 shadow-black/30 ring-white/15"
    >
      <Flag
        aria-hidden="true"
        focusable="false"
        className={className ?? "h-4 w-6"}
      />
    </span>
  );
}

function FlagSlot({ code }: { code: string }) {
  // Keep center text truly centered even when we can't render a flag.
  return (
    <div className="flex h-4 w-6 items-center justify-start">
      <FlagIcon code={code} className="h-4 w-6" />
    </div>
  );
}

export function FallbackClient() {
  const params = useSearchParams();
  const id = params.get("id")?.trim() || "";
  const country = params.get("country");
  const scope = params.get("scope"); // optional: "all" to probe all storefront groups

  const store = id ? detectPlatform(id) : null;
  const encodedId = encodeURIComponent(id);

  // SWR for Apple App Stores (must be called unconditionally to satisfy Hooks rules)
  const shouldFetch = store === "ios" && Boolean(id);
  const { data, isLoading, error } = useSWR(
    shouldFetch
      ? `/api/availability?id=${encodedId}${country ? `&country=${encodeURIComponent(country)}` : ""}${scope ? `&scope=${encodeURIComponent(scope)}` : ""}`
      : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  const availableStores = data?.available ?? [];
  const app = data?.app as
    | {
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
      }
    | null
    | undefined;

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
              {app && (
                <div className="mx-auto mb-4 w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-4 text-left">
                  <div className="flex items-center gap-3">
                    {app.iconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={app.iconUrl}
                        alt=""
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-xl"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-xl bg-white/10" />
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-white">
                        {app.name}
                      </p>
                      <p className="truncate text-sm text-gray-300">
                        {app.developer}
                        {app.genre ? ` • ${app.genre}` : ""}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {app.rating != null
                          ? `${app.rating.toFixed(1)}★${
                              app.ratingCount != null
                                ? ` (${app.ratingCount.toLocaleString()})`
                                : ""
                            }`
                          : "Rating unavailable"}
                        {app.price ? ` • ${app.price}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-center">
                    {(() => {
                      const primaryCc = availableStores[0];
                      return (
                        <a
                          href={`https://apps.apple.com/${availableStores[0]}/app/${encodedId}`}
                          className="grid w-full max-w-xs grid-cols-[24px_1fr_24px] items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        >
                          <FlagSlot code={primaryCc} />
                          <span className="text-center">
                            Open in
                            <br />
                            {appStoreRegionLabel(primaryCc)} Store
                          </span>
                          <AppStoreIcon className="h-5 w-5 justify-self-end text-white/90" />
                        </a>
                      );
                    })()}
                  </div>
                </div>
              )}

              <p className="mb-2 text-sm text-gray-500">Also available in:</p>
              <ul className="mx-auto flex w-full max-w-xs flex-col gap-2 text-sm">
                {availableStores.map((cc: string) => {
                  const label = appStoreRegionLabel(cc);

                  return (
                    <li key={cc}>
                      <a
                        href={`https://apps.apple.com/${cc}/app/${encodedId}`}
                        className="grid w-full grid-cols-[24px_1fr_24px] items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-blue-200 transition hover:bg-white/10 hover:text-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                      >
                        <FlagSlot code={cc} />
                        <span className="text-center">{label} Store</span>
                        <AppStoreIcon className="h-5 w-5 justify-self-end text-blue-200/80" />
                      </a>
                    </li>
                  );
                })}
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
