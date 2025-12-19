"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { detectPlatform, Platform } from "@/lib/platform";

const EXAMPLE_APPS = [
  { id: "id324684580", label: "iOS example (Spotify)" },
  { id: "com.spotify.music", label: "Android example (Spotify)" },
];

export function HomeForm() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
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

  async function handleCopy() {
    const id = appId.trim();
    if (!id || !detectedPlatform) return;

    const url = `${window.location.origin}/link?id=${encodeURIComponent(id)}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Optional: fallback or silent fail
    }
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
        autoFocus
        type="text"
        value={appId}
        onChange={(e) => setAppId(e.target.value.trimStart())}
        placeholder="e.g., id324684580 or com.spotify.music"
        className="mt-1 mb-6 w-full rounded-md border border-slate-700 bg-transparent p-2 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/80 focus:outline-none"
        required
      />

      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-400">
        <span className="opacity-70">Try:</span>
        {EXAMPLE_APPS.map((example) => (
          <button
            key={example.id}
            type="button"
            onClick={() => setAppId(example.id)}
            className="rounded-md border border-slate-700 px-2 py-1 font-mono text-slate-300 transition-colors hover:border-blue-500/60 hover:bg-blue-500/10 hover:text-slate-100 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
          >
            {example.id}
          </button>
        ))}
      </div>

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

      <button
        type="button"
        onClick={handleCopy}
        disabled={!isValid}
        className={`mt-3 w-full rounded-md border border-slate-700 py-2 text-sm font-medium transition-colors ${
          isValid
            ? "cursor-pointer text-slate-200 hover:border-blue-500/60 hover:bg-blue-500/10"
            : "cursor-not-allowed text-slate-500"
        }`}
      >
        {copied ? "Link copied ✓" : "Copy link"}
      </button>
    </form>
  );
}
