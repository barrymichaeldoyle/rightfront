"use client";

import { useEffect } from "react";
import Link from "next/link";

function BrandMark() {
  return (
    <span className="font-semibold tracking-tight">
      <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
        Right
      </span>
      <span className="relative -top-0.5 mx-0.5 font-bold text-slate-100">
        |
      </span>
      <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
        Front
      </span>
    </span>
  );
}

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep logs in prod for server-side debugging.
    console.error("Route error boundary:", error);
  }, [error]);

  return (
    <main className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 text-slate-100">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900/20 p-6 shadow-2xl shadow-black/20">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold tracking-tight">
            <BrandMark />
          </h1>
          <span className="rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-semibold tracking-wide text-red-200 ring-1 ring-red-400/20">
            ERROR
          </span>
        </div>

        <p className="mt-4 text-sm text-slate-300">
          Something went wrong while loading this page.
        </p>

        {error?.digest ? (
          <p className="mt-2 text-xs text-slate-400">
            Digest:{" "}
            <span className="font-mono text-slate-200">{error.digest}</span>
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="cursor-pointer rounded-md bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-sky-400 hover:to-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-md border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
