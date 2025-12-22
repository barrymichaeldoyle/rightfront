"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const storefrontOptions = [
  { value: "us", label: "United States (US)" },
  { value: "gb", label: "United Kingdom (GB)" },
  { value: "de", label: "Germany (DE)" },
  { value: "in", label: "India (IN)" },
  { value: "au", label: "Australia (AU)" },
  { value: "za", label: "South Africa (ZA)" },
] as const;

type Storefront = (typeof storefrontOptions)[number]["value"];

const fallbackExamples = [
  {
    name: "BBC iPlayer",
    id: "id416580485",
    blurb: "Strong territory restriction (great for region mismatch demos).",
    scopeAll: false,
  },
  {
    name: "NHS App",
    id: "id1388411277",
    blurb:
      "Often yields useful alternatives when a storefront doesn’t carry it.",
    scopeAll: false,
  },
  {
    name: "VALR Crypto Exchange & Wallet",
    id: "id1453499428",
    blurb: "Good mismatch case: available in many storefronts but not US.",
    scopeAll: true,
  },
] as const;

function buildFallbackHref({
  id,
  country,
  scopeAll,
}: {
  id: string;
  country: Storefront;
  scopeAll: boolean;
}) {
  const params = new URLSearchParams({ id, country });
  if (scopeAll) {
    params.set("scope", "all");
  }
  return `/fallback?${params.toString()}`;
}

export function FallbackDemo() {
  const [country, setCountry] = useState<Storefront>("us");

  const exampleLinks = useMemo(
    () =>
      fallbackExamples.map((ex) => ({
        ...ex,
        href: buildFallbackHref({
          id: ex.id,
          country,
          scopeAll: ex.scopeAll,
        }),
      })),
    [country],
  );

  const moreLinks = useMemo(
    () => ({
      bbc: buildFallbackHref({ id: "id416580485", country, scopeAll: false }),
      nhs: buildFallbackHref({ id: "id1388411277", country, scopeAll: false }),
      hotstar: buildFallbackHref({
        id: "id934459219",
        country,
        scopeAll: false,
      }),
      valrAll: buildFallbackHref({
        id: "id1453499428",
        country,
        scopeAll: true,
      }),
    }),
    [country],
  );

  return (
    <section className="relative z-10 border-t border-gray-800 px-6 py-12">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-100">
              See the fallback page in action
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              When a store listing isn&apos;t available in a given storefront,
              RightFront can show a clean fallback page with clear options
              instead of a dead-end “Not Available” error.
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <span className="whitespace-nowrap">Simulate storefront</span>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value as Storefront)}
              className="rounded-md border border-slate-600 bg-slate-900/40 px-2 py-1.5 text-sm text-slate-100 shadow-sm ring-0 transition outline-none hover:border-slate-500 focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              {storefrontOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {exampleLinks.map((ex) => (
            <div
              key={ex.id}
              className="rounded-xl border border-slate-800 bg-slate-900/30 p-4"
            >
              <div className="text-sm font-semibold text-slate-100">
                {ex.name}
              </div>
              <div className="mt-1 font-mono text-xs text-slate-400">
                {ex.id}
              </div>
              <p className="mt-3 text-sm text-slate-300">{ex.blurb}</p>
              <Link
                href={ex.href}
                className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-md bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-200 ring-1 ring-slate-800 transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                Open fallback demo →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
