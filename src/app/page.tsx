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
      <header className="relative z-10 flex items-center justify-between border-b border-gray-800 px-6 py-4">
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
                  className="rounded-md border border-slate-700 bg-slate-900/40 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:bg-slate-900 focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton>
                <button
                  type="button"
                  className="rounded-md bg-gradient-to-r from-sky-500 to-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:from-sky-400 hover:to-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400"
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
      </header>

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
