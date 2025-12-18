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
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800">RightFront</h1>
        <nav>
          <a
            href="https://twitter.com"
            className="text-gray-600 hover:text-gray-900 mr-4"
          >
            Twitter
          </a>
          <a
            href="https://github.com"
            className="text-gray-600 hover:text-gray-900"
          >
            GitHub
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-4">
        <h2 className="text-5xl font-bold mb-4 text-gray-800">
          Smart App Store Links. <br /> Every Time, in the Right Front.
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          RightFront automatically redirects your users to the correct App or
          Play Store page based on their country. No more broken Apple “Not
          Found” pages.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg px-6 py-4 w-full max-w-md border border-gray-100"
        >
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm text-gray-700 text-left">
              App ID
            </label>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded ${
                detectedPlatform === "ios"
                  ? "bg-blue-100 text-blue-700"
                  : detectedPlatform === "android"
                  ? "bg-green-100 text-green-700"
                  : "invisible"
              }`}
            >
              {detectedPlatform === "ios" ? "iOS" : "Android"}
            </span>
          </div>
          <input
            type="text"
            value={appId}
            onChange={(e) => setAppId(e.target.value.trim())}
            placeholder="e.g., id324684580 or com.spotify.music"
            className="w-full border rounded-md p-2 mb-6 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            disabled={!isValid}
            className={`w-full text-white font-semibold py-2 rounded-md transition-colors ${
              isValid
                ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Create Smart Link
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-gray-100 text-sm text-gray-500">
        © {new Date().getFullYear()} RightFront — Built for indie devs &
        marketers.
      </footer>
    </main>
  );
}
