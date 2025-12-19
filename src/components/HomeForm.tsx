"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { detectPlatform, Platform } from "@/lib/platform";

export function HomeForm() {
  const router = useRouter();
  const [appId, setAppId] = useState("");
  const [isPending, startTransition] = useTransition();

  const detectedPlatform = useMemo<Platform | null>(() => {
    if (!appId.trim()) {
      return null;
    }
    return detectPlatform(appId.trim());
  }, [appId]);

  const isValid = detectedPlatform !== null && appId.trim().length > 0;
  const isDisabled = !isValid || isPending;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isDisabled) {
      return;
    }
    const id = appId.trim();
    startTransition(() => {
      router.push(`/link?id=${encodeURIComponent(id)}`);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-xl border border-slate-700/80 bg-slate-900 px-6 py-6 shadow-xl shadow-black/20 transition-shadow hover:shadow-2xl"
    >
      <div className="mb-1 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">App ID</label>
        <span
          className={`rounded px-2 py-1 text-xs font-semibold ${
            detectedPlatform === "ios"
              ? "bg-blue-500/20 text-blue-400"
              : detectedPlatform === "android"
                ? "bg-green-500/20 text-green-400"
                : "invisible"
          }`}
        >
          {detectedPlatform === "ios" ? "iOS" : "Android"}
        </span>
      </div>

      <input
        type="text"
        value={appId}
        onChange={(e) => setAppId(e.target.value)}
        placeholder="e.g., id324684580 or com.spotify.music"
        className="mt-1 mb-6 w-full rounded-md border border-slate-700 bg-transparent p-2 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/80 focus:outline-none"
        required
      />

      <button
        type="submit"
        disabled={isDisabled}
        aria-busy={isPending}
        className={`w-full rounded-md py-2 font-medium transition-all duration-200 ${
          !isDisabled
            ? "cursor-pointer bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 hover:shadow-md hover:shadow-blue-500/30 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:outline-none active:translate-y-px"
            : "cursor-not-allowed bg-slate-700 text-slate-400"
        }`}
      >
        <span className="inline-flex items-center justify-center gap-2">
          {isPending ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                aria-hidden="true"
              />
              Redirecting…
            </>
          ) : (
            <>Go to Storefront</>
          )}
        </span>
      </button>
    </form>
  );
}
