"use client";

import { SVGProps } from "react";
import { useSearchParams } from "next/navigation";

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

export function FallbackClient() {
  const params = useSearchParams();
  const id = params.get("id");
  const country = params.get("country");

  if (!id) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <h1 className="mb-4 text-3xl font-semibold">Invalid Link</h1>
        <p className="mb-6 max-w-lg text-gray-600">Missing app ID.</p>
      </main>
    );
  }

  const store = detectPlatform(id);

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

  const storeName = store === "ios" ? "App Store" : "Play Store";
  const encodedId = encodeURIComponent(id);
  const usStoreUrl =
    store === "ios"
      ? `https://apps.apple.com/us/app/${encodedId}`
      : `https://play.google.com/store/apps/details?id=${encodedId}`;
  const genericStoreUrl =
    store === "ios"
      ? `https://apps.apple.com/app/${encodedId}`
      : `https://play.google.com/store/apps/details?id=${encodedId}`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="mb-1 text-3xl font-semibold">App Not Available</h1>
      <p className="mb-2 max-w-lg text-gray-600">
        This app isn&apos;t available in your region (
        {country?.toUpperCase() || "Unknown"}
        ). App availability is controlled by the store owner, not RightFront.
      </p>
      <a
        href={usStoreUrl}
        className="inline-flex items-center gap-1 text-blue-500 underline"
      >
        Try the US {storeName} <ExternalLinkIcon className="h-4 w-4" />
      </a>
      <a
        href={genericStoreUrl}
        className="inline-flex items-center gap-1 text-blue-500 underline"
      >
        Try the Generic {storeName} <ExternalLinkIcon className="h-4 w-4" />
      </a>
    </main>
  );
}
