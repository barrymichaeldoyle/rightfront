"use client";

import { useMemo, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type RangeKey = "7d" | "30d" | "90d" | "all";

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8V2Z"
      />
    </svg>
  );
}

export function RangeToggle({
  current,
  paramName = "range",
}: {
  current: RangeKey;
  paramName?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const options: RangeKey[] = useMemo(() => ["7d", "30d", "90d", "all"], []);

  function hrefFor(k: RangeKey): string {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set(paramName, k);
    return `${pathname}?${params.toString()}`;
  }

  return (
    <div className="grid gap-1.5">
      <div className="flex flex-wrap items-center gap-2">
        {options.map((k) => {
          const active = k === current;
          const href = hrefFor(k);

          return (
            <Link
              key={k}
              href={href}
              prefetch
              aria-current={active ? "page" : undefined}
              onClick={(e) => {
                // Let the browser handle modified clicks (new tab, etc).
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const me = e as any;
                if (
                  e.metaKey ||
                  e.ctrlKey ||
                  e.shiftKey ||
                  e.altKey ||
                  me?.button === 1
                ) {
                  return;
                }
                e.preventDefault();
                startTransition(() => {
                  router.push(href);
                });
              }}
              className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold ${
                active
                  ? "border-sky-400/30 bg-sky-500/10 text-sky-200"
                  : "border-slate-700 bg-slate-950/40 text-slate-200 hover:bg-slate-900/40"
              } ${isPending ? "cursor-wait" : ""}`}
            >
              {k === "all" ? "All" : k}
            </Link>
          );
        })}
      </div>

      {/* Reserve height to avoid layout shift */}
      <div className="min-h-[16px] text-xs text-slate-400">
        <div
          className={`flex items-center justify-end gap-2 transition-opacity ${
            isPending ? "opacity-100" : "opacity-0"
          }`}
        >
          <Spinner className="h-3.5 w-3.5 animate-spin text-slate-400" />
          <span>Updating…</span>
        </div>
      </div>
    </div>
  );
}
