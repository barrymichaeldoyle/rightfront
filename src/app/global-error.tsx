"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/Button";

import "@/styles/globals.css";

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

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error boundary:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased">
        <main className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
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
                APPLICATION ERROR
              </span>
            </div>

            <p className="mt-4 text-sm text-slate-300">
              A server-side error occurred while loading this page.
            </p>

            {error?.digest ? (
              <p className="mt-2 text-xs text-slate-400">
                Digest:{" "}
                <span className="font-mono text-slate-200">{error.digest}</span>
              </p>
            ) : null}

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button type="button" onClick={() => reset()} variant="primary">
                Try again
              </Button>
              <Button href="/" variant="secondary">
                Go home
              </Button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
