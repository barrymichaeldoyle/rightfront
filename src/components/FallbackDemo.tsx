"use client";

import { useMemo, useState } from "react";

import { BrandMark } from "@/components/BrandLogo";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { Button } from "@/components/ui/Button";
import { config } from "@/lib/config";

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
    blurb: "Only available in the UK (GB).",
    scopeAll: false,
  },
  {
    name: "NHS App",
    id: "id1388411277",
    blurb: "Available in the UK (GB), US and AU.",
    scopeAll: false,
  },
  ...(config.env === "development"
    ? [
        {
          name: "VALR Crypto Exchange & Wallet",
          id: "id1453499428",
          blurb: "Available in many storefronts, but not US.",
          scopeAll: true,
        },
      ]
    : []),
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
  if (scopeAll) params.set("scope", "all");
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

  return (
    <section className="relative z-10 border-t border-slate-800/80 bg-slate-950 px-6 py-20 text-slate-100">
      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-3xl leading-tight font-extrabold tracking-tight text-white md:text-4xl">
              See the fallback page in action
            </h3>
            <p className="mt-2 max-w-2xl text-slate-300/90">
              When a store listing isn&apos;t available in a given storefront,
              <span className="ml-1 font-semibold tracking-tight text-slate-100">
                <BrandMark />
              </span>{" "}
              can show a clean fallback page with clear options instead of a
              dead-end “Not Available” error.
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <span className="whitespace-nowrap">Simulate region</span>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value as Storefront)}
              className="rounded-md border border-slate-700 bg-slate-900/70 px-2 py-1.5 text-sm text-slate-100 shadow-sm transition hover:border-slate-600 focus:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              {storefrontOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {exampleLinks.map((ex) => (
            <div
              key={ex.id}
              className="group flex flex-col justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-md shadow-slate-900/40 backdrop-blur-sm transition-all"
            >
              <div>
                <h4 className="text-lg font-semibold text-slate-100 transition-colors group-hover:text-white">
                  {ex.name}
                </h4>
                <p className="mt-1 font-mono text-xs text-slate-400/90">
                  {ex.id}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300/90">
                  {ex.blurb}
                </p>
              </div>

              <Button
                href={ex.href}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                fullWidth
                className="mt-5"
              >
                <span>Open fallback demo</span>
                <ExternalLinkIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
