"use client";

import { useSearchParams } from "next/navigation";
import { detectPlatform } from "@/lib/platform";

export default function FallbackPage() {
  const params = useSearchParams();
  const id = params.get("id");
  const country = params.get("country");

  if (!id) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <h1 className="text-3xl font-semibold mb-4">Invalid Link</h1>
        <p className="text-gray-600 mb-6 max-w-lg">Missing app ID.</p>
      </main>
    );
  }

  const store = detectPlatform(id);

  if (!store) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <h1 className="text-3xl font-semibold mb-4">Invalid App ID</h1>
        <p className="text-gray-600 mb-6 max-w-lg">
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
    <main className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-3xl font-semibold mb-4">App Not Available</h1>
      <p className="text-gray-600 mb-6 max-w-lg">
        Sorry, this {storeName} app (ID: {id}) isn&apos;t available in your
        region ({country?.toUpperCase() || "Unknown"}).
      </p>
      <a href={usStoreUrl} className="text-blue-500 underline">
        Try the US Store
      </a>
    </main>
  );
}
