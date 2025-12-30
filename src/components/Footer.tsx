import Link from "next/link";

import { NavigationLinks } from "@/components/NavigationLinks";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-slate-800/80 bg-slate-900/95 py-8 shadow-md shadow-slate-900/40 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Navigation Links */}
          <div className="flex flex-col gap-3 text-sm">
            <h3 className="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Navigation
            </h3>
            <NavigationLinks
              variant="vertical"
              linkClassName="text-slate-300"
            />
          </div>

          {/* Legal Links */}
          <nav className="flex flex-col gap-3 text-sm">
            <h3 className="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Legal
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/privacy"
                className="text-slate-300 transition-colors hover:text-slate-100 focus-visible:text-slate-100 focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                Privacy Policy
              </Link>
            </div>
          </nav>

          {/* Branding & Copyright */}
          <div className="flex flex-col gap-2 text-sm">
            <h3 className="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">
              RightFront
            </h3>
            <p className="leading-relaxed text-slate-300">
              <span className="text-slate-400">
                © {new Date().getFullYear()}{" "}
              </span>
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
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Geo-aware store links that land right, every time.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
