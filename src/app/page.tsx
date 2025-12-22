import Link from "next/link";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import { FallbackDemo } from "@/components/FallbackDemo";
import { HomeForm } from "@/components/HomeForm";

export default function HomePage() {
  return (
    <main className="relative isolate flex min-h-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      <header className="relative z-10 border-b border-gray-800 px-6 py-4">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
          {/* Logo */}
          <h1 className="text-2xl font-semibold tracking-tight">
            <Link
              href="/"
              className="focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
                Right
              </span>
              <span className="relative -top-0.5 mx-0.5 font-bold text-slate-100">
                |
              </span>
              <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
                Front
              </span>
            </Link>

            <span className="ml-2 rounded-full bg-sky-500/20 px-2 py-0.5 align-middle text-xs font-semibold tracking-wide text-sky-300">
              beta
            </span>
          </h1>

          <div className="flex items-center gap-4">
            {/* Simple Nav */}
            <nav className="flex items-center gap-4 text-sm text-slate-400">
              <a
                href="/how-it-works"
                className="rounded transition-colors hover:text-slate-100 focus-visible:text-slate-100 focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                How it works
              </a>
            </nav>

            <div className="hidden h-6 w-px bg-gray-800 sm:block" aria-hidden />

            <div className="flex items-center gap-2">
              <SignedOut>
                <SignInButton>
                  <button
                    type="button"
                    className="cursor-pointer rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button
                    type="button"
                    className="cursor-pointer rounded-md bg-gradient-to-r from-sky-500 to-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:from-sky-400 hover:to-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    Sign up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      <SignedIn>
        <section className="relative z-10 border-b border-gray-800 px-6 py-10">
          <div className="mx-auto w-full max-w-5xl">
            <div className="relative overflow-hidden rounded-2xl border border-amber-400/20 bg-gradient-to-b from-amber-500/10 via-slate-900/30 to-slate-900/10 p-6 text-left md:p-8">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold tracking-wide text-amber-200 ring-1 ring-amber-400/20">
                    ACTIVE BETA
                  </span>
                  <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-100 md:text-2xl">
                    Stable links today.
                    <br />
                    Per-user permalinks coming next.
                  </h2>
                  <p className="mt-2 inline-block text-sm leading-relaxed text-slate-300">
                    While we&apos;re in active beta, you&apos;re safe to share
                    and use normal{" "}
                    <span className="rounded bg-slate-950/60 px-2 py-0.5 font-mono text-slate-100 ring-1 ring-slate-800">
                      rightfront.app/link?id={"{"}app-id{"}"}
                    </span>{" "}
                    links.
                  </p>
                </div>

                <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <p className="text-sm font-semibold text-slate-100">
                    Our promise during beta
                  </p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-300">
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300/80" />
                      <span>
                        We&apos;ll give{" "}
                        <span className="font-semibold text-slate-200">
                          at least 30 days
                        </span>{" "}
                        warning by email before any breaking changes.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300/80" />
                      Your existing links will continue to work while we roll
                      out permalinks.
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300/80" />
                      We&apos;re actively improving routing + fallback behavior
                      based on real storefront results.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </SignedIn>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center px-6 py-16 text-center">
        <h2 className="mb-4 leading-tight drop-shadow">
          <span className="mb-2 block text-xl font-semibold text-slate-100 md:text-2xl">
            Send users to the
          </span>

          <span className="block text-6xl font-extrabold tracking-tight md:text-7xl">
            <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
              Right
            </span>{" "}
            <span className="font-bold text-slate-100">App Store</span>
            <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
              Front
            </span>
          </span>

          <span className="mt-6 block text-2xl font-semibold tracking-tight text-slate-100/90 md:text-3xl">
            Every time, in every country.
          </span>
        </h2>
        <p
          className="mt-6 mb-10 max-w-3xl text-lg text-slate-200/80"
          style={{ textWrap: "balance" }}
        >
          A geo-aware link that routes each user to the correct{" "}
          <span className="font-semibold text-slate-100">App Store</span> or{" "}
          <span className="font-semibold text-slate-100">Play Store</span> for
          their country or region whenever supported. Stop losing installs to{" "}
          <span className="font-semibold text-sky-200">“Not Available”</span>{" "}
          pages.
        </p>

        <HomeForm />
        <p className="mt-4 max-w-md text-center text-xs text-slate-400/80">
          Play Store localization depends on Google account, region, and
          availability.
        </p>

        <SignedOut>
          <div className="my-10 w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/30 p-5 text-left">
            <div className="flex flex-col items-center justify-between gap-4">
              <div className="w-full max-w-xl">
                <p className="text-sm font-semibold text-slate-100">
                  Want permalinks for your iOS App Store pages?
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Create an account to generate and manage your own{" "}
                  <span className="font-semibold tracking-tight">
                    <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
                      Right
                    </span>
                    <span className="relative -top-0.25 mx-0.5 font-bold text-slate-100">
                      |
                    </span>
                    <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
                      Front
                    </span>
                  </span>{" "}
                  permalinks.
                </p>
              </div>
              <div className="flex w-full max-w-xl flex-1 flex-col gap-2 sm:flex-row">
                <SignUpButton>
                  <button
                    type="button"
                    className="flex-1 cursor-pointer rounded-md bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-sky-400 hover:to-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    Sign up to generate permalinks
                  </button>
                </SignUpButton>
                <SignInButton>
                  <button
                    type="button"
                    className="flex-1 cursor-pointer rounded-md border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    Sign in
                  </button>
                </SignInButton>
              </div>
            </div>
          </div>
        </SignedOut>
      </section>

      <FallbackDemo />

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-6 text-center text-sm text-slate-400">
        <p className="leading-relaxed">
          <span className="opacity-80">© {new Date().getFullYear()} </span>
          <span className="font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
              Right
            </span>
            <span className="relative -top-0.25 mx-0.5 font-bold text-slate-100">
              |
            </span>
            <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
              Front
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
