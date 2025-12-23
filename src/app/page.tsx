import Link from "next/link";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import type { Metadata } from "next";

import { BrandLogo } from "@/components/BrandLogo";
import { FallbackDemo } from "@/components/FallbackDemo";
import { HomeForm } from "@/components/HomeForm";

export const metadata: Metadata = {
  title: "RightFront — Smart App Store Links That Work Worldwide",
  description:
    "Create one geo-aware link for the App Store and Play Store that routes each user to the correct regional storefront. Stop losing installs to “Not Available” pages.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  return (
    <main className="relative isolate flex min-h-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      <header className="relative z-10 border-b border-gray-800 px-6 py-4">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
          {/* Logo */}
          <BrandLogo href="/" />

          <div className="flex items-center gap-4">
            {/* Simple Nav */}
            <nav className="flex items-center gap-4 text-sm text-slate-400">
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="rounded transition-colors hover:text-slate-100 focus-visible:text-slate-100 focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  Dashboard
                </Link>
              </SignedIn>
              <Link
                href="/how-it-works"
                className="rounded transition-colors hover:text-slate-100 focus-visible:text-slate-100 focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                How it works
              </Link>
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
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="mb-4 leading-tight drop-shadow">
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
        </h1>
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
