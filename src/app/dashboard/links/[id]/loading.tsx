import { LinkAnalyticsSkeleton } from "./LinkAnalyticsSkeleton";

export default function Loading() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="h-7 w-40 animate-pulse rounded bg-slate-800/60" />
          <div className="mt-2 h-4 w-56 animate-pulse rounded bg-slate-800/40" />
        </div>
        <div className="h-10 w-24 animate-pulse rounded-md bg-slate-800/50" />
      </div>

      <div className="mb-6">
        <LinkAnalyticsSkeleton />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="h-4 w-20 animate-pulse rounded bg-slate-800/60" />
            <div className="mt-2 h-10 w-full animate-pulse rounded-md bg-slate-800/40" />
            <div className="mt-2 h-3 w-48 animate-pulse rounded bg-slate-800/30" />
          </div>
          <div>
            <div className="h-4 w-20 animate-pulse rounded bg-slate-800/60" />
            <div className="mt-2 h-10 w-full animate-pulse rounded-md bg-slate-800/40" />
            <div className="mt-2 h-3 w-48 animate-pulse rounded bg-slate-800/30" />
          </div>
        </div>

        <div className="mt-5 h-10 w-36 animate-pulse rounded-md bg-slate-800/50" />

        <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-5">
          <div className="h-4 w-28 animate-pulse rounded bg-red-400/20" />
          <div className="mt-2 h-3 w-56 animate-pulse rounded bg-red-400/15" />
          <div className="mt-4 h-10 w-28 animate-pulse rounded-md bg-red-400/15" />
        </div>
      </div>
    </section>
  );
}
