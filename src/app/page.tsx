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
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { features } from "@/lib/features";

export const metadata: Metadata = {
  title: "RightFront — Smart App Store Links That Work Worldwide",
  description:
    "Create one geo-aware App Store link that routes each user to the correct regional storefront worldwide. Stop losing installs to “Not Available” pages.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const androidEnabled = features.androidEnabled;
  return (
    <main className="relative isolate flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-900/95 px-6 py-4 shadow-md shadow-slate-900/40 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
          {/* Logo */}
          <BrandLogo href="/" />

          <div className="flex items-center gap-4">
            {/* Nav */}
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

            <div
              className="hidden h-6 w-px bg-slate-800/80 sm:block"
              aria-hidden
            />

            <div className="flex items-center gap-2">
              <SignedOut>
                <SignInButton
                  mode="modal"
                  forceRedirectUrl="/dashboard"
                  fallbackRedirectUrl="/dashboard"
                >
                  <Button type="button" variant="secondary" size="sm">
                    Sign in
                  </Button>
                </SignInButton>
                <SignUpButton
                  mode="modal"
                  forceRedirectUrl="/dashboard"
                  fallbackRedirectUrl="/dashboard"
                >
                  <Button type="button" variant="primary" size="sm">
                    Sign up
                  </Button>
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
          </span>{" "}
          <span className="block text-6xl font-extrabold tracking-tight md:text-7xl">
            <span className="animate-gradient-shine bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
              Right
            </span>{" "}
            <span className="font-bold text-slate-100">App Store</span>
            <span className="animate-gradient-shine bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
              Front
            </span>
          </span>{" "}
          <span className="mt-6 block text-2xl font-semibold tracking-tight text-slate-100/90 md:text-3xl">
            Every time, in every country.
          </span>
        </h1>
        <p
          className="mt-6 mb-10 max-w-3xl text-lg text-slate-300/90"
          style={{ textWrap: "balance" }}
        >
          A geo-aware link that routes each user to the correct{" "}
          <span className="font-semibold text-slate-100">App Store</span>
          {androidEnabled ? (
            <>
              {" "}
              or{" "}
              <span className="font-semibold text-slate-100">Play Store</span>
            </>
          ) : null}{" "}
          for their country or region whenever supported. Stop losing installs
          to <span className="font-semibold text-sky-300">“Not Available”</span>{" "}
          pages.
        </p>

        <HomeForm />

        <SignedOut>
          <Card className="my-10 w-full max-w-2xl text-left">
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
                <SignUpButton
                  mode="modal"
                  forceRedirectUrl="/dashboard"
                  fallbackRedirectUrl="/dashboard"
                >
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    className="flex-1"
                  >
                    Sign up to generate permalinks
                  </Button>
                </SignUpButton>
                <SignInButton
                  mode="modal"
                  forceRedirectUrl="/dashboard"
                  fallbackRedirectUrl="/dashboard"
                >
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    className="flex-1"
                  >
                    Sign in
                  </Button>
                </SignInButton>
              </div>
            </div>
          </Card>
        </SignedOut>
      </section>

      <FallbackDemo />
    </main>
  );
}
