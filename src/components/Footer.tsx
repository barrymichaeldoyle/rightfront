import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-slate-800 bg-slate-950 py-6 text-center text-sm text-slate-400">
      <p className="leading-relaxed">
        <span className="text-slate-500">© {new Date().getFullYear()} </span>
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
        <span className="text-slate-500">
          {" "}
          — geo-aware store links that land right, every time.
        </span>
      </p>
      <p className="mt-2 text-xs text-slate-500">
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-slate-200"
        >
          Privacy Policy
        </Link>
      </p>
    </footer>
  );
}
