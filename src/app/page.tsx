"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { detectPlatform } from "@/lib/platform";

export default function HomePage() {
  const router = useRouter();
  const [appId, setAppId] = useState("");

  const detectedPlatform = useMemo(() => {
    if (!appId.trim()) {
      return null;
    }
    return detectPlatform(appId.trim());
  }, [appId]);

  const isValid = detectedPlatform !== null && appId.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      return;
    }
    router.push(`/link?id=${encodeURIComponent(appId.trim())}`);
  };

  return (
    <main className="relative isolate flex flex-col min-h-screen overflow-hidden bg-[--color-bg] text-[--color-text]">
      {/* Header */}
      <header className="relative z-10 px-6 py-4 border-b border-gray-800 flex justify-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
            Right
          </span>
          <span className="text-[--color-text-muted] font-bold mx-0.5 relative -top-0.5">
            |
          </span>
          <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
            front
          </span>
        </h1>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center">
        <h2 className="mb-4 leading-tight drop-shadow">
          <span className="block text-xl md:text-2xl font-semibold text-[--color-text-muted] mb-2">
            Send users to the
          </span>

          <span className="block text-6xl md:text-7xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
              Right
            </span>{" "}
            <span className="text-[--color-text-muted] font-bold">Store</span>
            <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
              front
            </span>
          </span>

          <span className="block text-2xl md:text-3xl font-semibold text-[--color-text-muted] mt-6 tracking-tight">
            every time, in every country.
          </span>
        </h2>
        <p
          className="text-lg text-[--color-text-muted] max-w-3xl mt-6 mb-10"
          style={{ textWrap: "balance" }}
        >
          A geo‑aware link that routes each user to the correct App Store or
          Play Store for their country or region. Stop losing installs to “Not
          Available” pages.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[--color-surface] border border-gray-700/80 shadow-xl rounded-xl px-6 py-6 w-full max-w-md hover:shadow-2xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-gray-300 font-medium">App ID</label>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded ${
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
            className="w-full border border-gray-700 rounded-md p-2 mt-1 mb-6 bg-transparent text-gray-100 focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
            required
          />

          <button
            type="submit"
            disabled={!isValid}
            className={`w-full font-medium py-2 rounded-md transition-all duration-200 ${
              isValid
                ? "cursor-pointer bg-[--color-primary] text-white shadow-md shadow-blue-500/20 bg-blue-600 hover:shadow-md hover:brightness-110 hover:shadow-blue-500/30 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-primary] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-surface]"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            Create Smart Link
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 border-t border-gray-800 text-sm text-[--color-text-muted]">
        <p className="leading-relaxed">
          <span className="opacity-80">© {new Date().getFullYear()} </span>
          <span className="font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
              Right
            </span>
            <span className="text-[--color-text-muted] font-bold mx-0.5 relative -top-0.25">
              |
            </span>
            <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
              front
            </span>
          </span>
          <span className="opacity-80">
            {" "}
            — geo-aware store links that land right, every time.
          </span>
        </p>
      </footer>
    </main>
  );
}
