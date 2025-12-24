"use client";

import { useMemo, useState } from "react";

import { CopyIcon } from "@/components/icons/CopyIcon";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { Button } from "@/components/ui/Button";
import { features } from "@/lib/features";
import { detectPlatform, Platform } from "@/lib/platform";

const EXAMPLE_APPS = [{ id: "id324684580" }];
const ANDROID_EXAMPLE_APP = { id: "com.spotify.music" };

export function HomeForm() {
  const [copied, setCopied] = useState(false);
  const [appId, setAppId] = useState("");
  const [isOpening, setIsOpening] = useState(false);
  const androidEnabled = features.androidEnabled;

  const detectedPlatform = useMemo<Platform | null>(() => {
    if (!appId.trim()) {
      return null;
    }
    return detectPlatform(appId.trim());
  }, [appId]);

  const isValid =
    detectedPlatform !== null &&
    appId.trim().length > 0 &&
    (androidEnabled ? true : detectedPlatform === "ios");
  const isDisabled = !isValid || isOpening;

  const storefrontHref = useMemo(() => {
    if (!isValid) return null;
    const id = appId.trim();
    return `/link?id=${encodeURIComponent(id)}`;
  }, [appId, isValid]);

  async function handleCopy() {
    const id = appId.trim();
    if (!id || !detectedPlatform) return;
    if (!androidEnabled && detectedPlatform !== "ios") return;

    const url = `${window.location.origin}/link?id=${encodeURIComponent(id)}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Optional: fallback or silent fail
    }
  }

  const badgeText =
    detectedPlatform === "ios"
      ? "iOS"
      : detectedPlatform === "android" && androidEnabled
        ? "Android"
        : "";
  const badgePlaceholder = androidEnabled ? "Android" : "iOS";
  const showBadge = badgeText.length > 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!storefrontHref || isDisabled) return;
        try {
          setIsOpening(true);
          window.open(storefrontHref, "_blank", "noopener,noreferrer");
        } finally {
          window.setTimeout(() => setIsOpening(false), 1200);
        }
      }}
      className="w-full max-w-md rounded-xl border border-slate-700/80 bg-slate-900 px-6 py-6 shadow-xl shadow-black/20 transition-shadow hover:shadow-2xl"
    >
      <div className="mb-1 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">App ID</label>
        <span
          className={`inline-flex h-6 items-center rounded px-2 text-xs leading-none font-semibold transition-opacity ${
            showBadge ? "opacity-100" : "opacity-0"
          } ${
            badgeText === "iOS"
              ? "bg-blue-500/20 text-blue-400"
              : "bg-green-500/20 text-green-400"
          }`}
        >
          {showBadge ? badgeText : badgePlaceholder}
        </span>
      </div>

      <input
        autoFocus
        type="text"
        value={appId}
        onChange={(e) => setAppId(e.target.value.trimStart())}
        placeholder={
          androidEnabled
            ? "e.g., id324684580 or com.spotify.music"
            : "e.g., id324684580"
        }
        className="mt-1 mb-6 w-full rounded-md border border-slate-700 bg-transparent p-2 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/80 focus:outline-none"
        required
      />

      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-400">
        <span className="opacity-70">Try:</span>
        {[
          ...EXAMPLE_APPS,
          ...(androidEnabled ? [ANDROID_EXAMPLE_APP] : []),
        ].map((example) => (
          <Button
            key={example.id}
            type="button"
            onClick={() => setAppId(example.id)}
            variant="outline"
            size="xs"
            className="font-mono text-slate-300 hover:text-slate-100"
          >
            {example.id}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          disabled={isDisabled}
          aria-busy={isOpening}
          fullWidth
          loading={isOpening}
          withSpinner
          variant={!isDisabled ? "primary" : "secondary"}
        >
          <span className="inline-flex items-center justify-center gap-2">
            <span>{isOpening ? "Opening…" : "Go to Storefront"}</span>
            <ExternalLinkIcon className="h-4 w-4" />
          </span>
        </Button>

        <Button
          type="button"
          onClick={handleCopy}
          disabled={!isValid}
          fullWidth
          variant="outline"
        >
          {copied ? "Link copied" : "Copy link"}
          <CopyIcon className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
