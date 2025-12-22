import { ReactNode } from "react";
import Link from "next/link";

import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import { BrandLogo } from "@/components/BrandLogo";

import "@/styles/globals.css";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await auth.protect({ unauthenticatedUrl: "/" });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
          <BrandLogo href="/dashboard" />

          <nav className="flex items-center gap-4 text-sm text-slate-300">
            <Link
              href="/dashboard"
              className="rounded px-2 py-1 text-slate-300 transition hover:bg-slate-900/60 hover:text-slate-100 focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              Links
            </Link>
            <Link
              href="/dashboard/settings"
              className="rounded px-2 py-1 text-slate-300 transition hover:bg-slate-900/60 hover:text-slate-100 focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              Settings
            </Link>

            <div className="ml-2">
              <UserButton />
            </div>
          </nav>
        </div>
      </header>

      {children}
    </main>
  );
}
