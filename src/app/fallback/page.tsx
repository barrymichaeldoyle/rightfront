"use client";

import { useSearchParams } from "next/navigation";

import { detectPlatform } from "@/lib/platform";

export default function FallbackPage() {
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

  const storeName = store === "ios" ? "iOS" : "Android";
  const usStoreUrl =
    store === "ios"
      ? `https://apps.apple.com/us/app/${id}`
      : `https://play.google.com/store/apps/details?id=${id}`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="mb-4 text-3xl font-semibold">App Not Available</h1>
      <p className="mb-6 max-w-lg text-gray-600">
        Sorry, this {storeName} app (ID: {id}) isn&apos;t available in your
        region ({country?.toUpperCase() || "Unknown"}).
      </p>
      <a href={usStoreUrl} className="text-blue-500 underline">
        Try the US Store
      </a>
    </main>
  );
}
