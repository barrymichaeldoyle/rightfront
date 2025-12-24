"use client";

import { useSearchParams } from "next/navigation";

import * as FLAG_BY_CC from "country-flag-icons/react/3x2";
import useSWR from "swr";

import { AppleMarkIcon } from "@/components/icons/AppleMarkIcon";
import { features } from "@/lib/features";
import { detectPlatform } from "@/lib/platform";

const fetcher = (url: string) =>
  fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(r)));

function normalizeCountryCodeForFlag(code: string): string {
  const normalized = code.trim().toUpperCase();
  // Common alias: Apple uses "GB" while humans often type "UK".
  return normalized === "UK" ? "GB" : normalized;
}

const REGION_DISPLAY_NAMES: Intl.DisplayNames | null =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
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

function BrandMark() {
  return (
    <span className="font-semibold tracking-tight">
      <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
        Right
      </span>
      <span className="relative -top-0.25 mx-0.5 font-bold text-slate-100">
        |
      </span>
      <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
        Front
      </span>
    </span>
  );
}

function InlineStorefront({ code }: { code: string }) {
  const cc = normalizeCountryCodeForFlag(code);
  return (
    <span className="inline-flex items-center gap-1 align-middle">
      <FlagIcon code={cc} className="h-3.5 w-5" />
      <span className="font-mono text-slate-200">{cc}</span>
    </span>
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
  const { data: geoData } = useSWR("/api/geo", fetcher, {
    revalidateOnFocus: false,
  });

  const availableStores = data?.available ?? [];
  const storeMetas = (data?.stores ?? []) as Array<
    | {
        country: string;
        price: string | null;
        rating: number | null;
        ratingCount: number | null;
        storeUrl: string | null;
      }
    | undefined
  >;
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

  const selectedStorefront = (() => {
    if (!country) return null;
    const cc = country.trim().toLowerCase();
    return cc === "uk" ? "gb" : cc;
  })();

  const detectedStorefront = (() => {
    const raw =
      typeof geoData?.country === "string" ? geoData.country.trim() : "";
    if (!raw) return null;
    const cc = raw.toLowerCase();
    return cc === "uk" ? "gb" : cc;
  })();

  const detectedSource =
    typeof geoData?.source === "string" ? geoData.source : null;

  const isSimulatingDifferentStorefront =
    Boolean(selectedStorefront) &&
    Boolean(detectedStorefront) &&
    selectedStorefront !== detectedStorefront;

  const isAvailableInDetectedStorefront =
    store === "ios" &&
    !isLoading &&
    Boolean(detectedStorefront) &&
    availableStores.some(
      (cc: string) => cc.trim().toLowerCase() === detectedStorefront,
    );

  const isDemoAvailableInSelectedStorefront =
    store === "ios" &&
    !isLoading &&
    Boolean(selectedStorefront) &&
    availableStores.some(
      (cc: string) => cc.trim().toLowerCase() === selectedStorefront,
    );

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
          ID (e.g., <span className="font-mono">id284882215</span>)
          {features.androidEnabled ? (
            <>
              {" "}
              or Android package name (e.g.,{" "}
              <span className="font-mono">com.spotify.music</span>).
            </>
          ) : (
            "."
          )}
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="mb-1 text-3xl font-semibold">
        {isDemoAvailableInSelectedStorefront
          ? "Fallback Preview"
          : "App Not Available"}
      </h1>
      <p className="mb-2 max-w-lg text-slate-400">
        {isDemoAvailableInSelectedStorefront ? (
          <>
            This app appears to be available in the selected storefront (
            {country ? <InlineStorefront code={country} /> : "Unknown"}).
            You&apos;re viewing the fallback page directly for demonstration.
            {detectedStorefront && (
              <>
                {" "}
                Detected from your location:{" "}
                <InlineStorefront code={detectedStorefront} />
                {detectedSource ? (
                  <span className="text-slate-500"> ({detectedSource})</span>
                ) : null}
                {isSimulatingDifferentStorefront ? (
                  <>
                    {" "}
                    — simulating{" "}
                    <InlineStorefront code={selectedStorefront ?? ""} />.
                  </>
                ) : (
                  "."
                )}
              </>
            )}
            <br />A standard <BrandMark /> link (e.g.{" "}
            <a
              href={`/link?id=${encodedId}`}
              className="font-mono text-sky-300 underline-offset-4 hover:underline"
            >
              /link?id={id}
            </a>
            ) uses your detected storefront.{" "}
            {detectedStorefront ? (
              isAvailableInDetectedStorefront ? (
                <>
                  Since the app is available in{" "}
                  <InlineStorefront code={detectedStorefront} />, it will
                  redirect straight to the store page (and won&apos;t show this
                  fallback page).
                </>
              ) : (
                <>
                  Since the app is <span className="font-semibold">not</span>{" "}
                  available in <InlineStorefront code={detectedStorefront} />,
                  it will redirect to this fallback page instead.
                </>
              )
            ) : (
              <>
                If the app is available in your storefront, it will redirect
                straight to the store page; otherwise it will redirect to this
                fallback page.
              </>
            )}
          </>
        ) : (
          <>
            This app isn&apos;t available in your region (
            {country ? <InlineStorefront code={country} /> : "Unknown"}). App
            availability is controlled by the store owner, not <BrandMark />.
            {detectedStorefront && (
              <>
                {" "}
                Detected from your location:{" "}
                <InlineStorefront code={detectedStorefront} />
                {detectedSource ? (
                  <span className="text-slate-500"> ({detectedSource})</span>
                ) : null}
                {isSimulatingDifferentStorefront ? (
                  <>
                    {" "}
                    — simulating{" "}
                    <InlineStorefront code={selectedStorefront ?? ""} />.
                  </>
                ) : (
                  "."
                )}
              </>
            )}
          </>
        )}
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
              {(() => {
                const byCc = new Map(
                  storeMetas
                    .filter(Boolean)
                    .map((m) => [m!.country.trim().toLowerCase(), m!]),
                );

                const normalizedStores = availableStores
                  .map((cc: string) => cc.trim().toLowerCase())
                  .filter(Boolean);

                // Dedupe while preserving order.
                const uniqueStores = normalizedStores.filter(
                  (cc: string, idx: number) =>
                    normalizedStores.indexOf(cc) === idx,
                );

                const primaryCc = uniqueStores[0];
                const otherStores = uniqueStores.slice(1);
                const primaryMeta =
                  byCc.get(primaryCc.trim().toLowerCase()) ?? null;

                return (
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
                              {primaryMeta
                                ? formatMetaLine(primaryMeta)
                                : formatMetaLine({
                                    price: app.price,
                                    rating: app.rating,
                                    ratingCount: app.ratingCount,
                                  })}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex justify-center">
                          {(() => {
                            return (
                              <a
                                href={`https://apps.apple.com/${primaryCc}/app/${encodedId}`}
                                className="grid w-full max-w-xs grid-cols-[24px_1fr_24px] items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                              >
                                <FlagSlot code={primaryCc} />
                                <span className="text-center">
                                  Open in
                                  <br />
                                  {appStoreRegionLabel(primaryCc)} Store
                                </span>
                                <AppleMarkIcon className="h-5 w-5 justify-self-end text-white/90" />
                              </a>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    {otherStores.length > 0 && (
                      <>
                        <p className="mb-2 text-sm text-slate-400">
                          Also available in:
                        </p>
                        <ul className="mx-auto flex w-full max-w-xs flex-col gap-2 text-sm">
                          {otherStores.map((cc: string) => {
                            const label = appStoreRegionLabel(cc);
                            const meta =
                              byCc.get(cc.trim().toLowerCase()) ?? null;

                            return (
                              <li key={cc}>
                                <a
                                  href={`https://apps.apple.com/${cc}/app/${encodedId}`}
                                  className="grid w-full grid-cols-[24px_1fr_24px] items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-blue-200 transition hover:bg-white/10 hover:text-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                                >
                                  <FlagSlot code={cc} />
                                  <span className="text-center">
                                    <span className="block">{label} Store</span>
                                    {meta && (
                                      <span className="mt-0.5 block text-xs text-blue-200/70">
                                        {formatMetaLine(meta)}
                                      </span>
                                    )}
                                  </span>
                                  <AppleMarkIcon className="h-5 w-5 justify-self-end text-blue-200/80" />
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </>
                    )}
                  </>
                );
              })()}
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

function formatMetaLine(meta: {
  price: string | null;
  rating: number | null;
  ratingCount: number | null;
}) {
  const rating =
    meta.rating != null ? `${meta.rating.toFixed(1)}★` : "Rating unavailable";
  const count =
    meta.ratingCount != null ? ` (${meta.ratingCount.toLocaleString()})` : "";
  const price = meta.price ? ` • ${meta.price}` : "";
  return `${rating}${count}${price}`;
}
