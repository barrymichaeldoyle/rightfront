export function LinkAnalyticsSkeleton() {
  return (
    <section className="grid gap-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="h-4 w-24 animate-pulse rounded bg-slate-800/70" />
            <div className="mt-2 h-3 w-48 animate-pulse rounded bg-slate-800/50" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-12 animate-pulse rounded bg-slate-800/60" />
            <div className="h-8 w-12 animate-pulse rounded bg-slate-800/60" />
            <div className="h-8 w-12 animate-pulse rounded bg-slate-800/60" />
            <div className="h-8 w-12 animate-pulse rounded bg-slate-800/60" />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-800 bg-slate-950/30 p-4"
            >
              <div className="h-3 w-24 animate-pulse rounded bg-slate-800/60" />
              <div className="mt-3 h-7 w-16 animate-pulse rounded bg-slate-800/60" />
              <div className="mt-3 h-3 w-28 animate-pulse rounded bg-slate-800/40" />
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-800/60" />
            <div className="mt-2 h-3 w-40 animate-pulse rounded bg-slate-800/40" />
            <div className="mt-4 h-20 w-full animate-pulse rounded bg-slate-800/30" />
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-800/60" />
            <div className="mt-2 h-3 w-40 animate-pulse rounded bg-slate-800/40" />
            <div className="mt-4 grid gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="h-4 w-40 animate-pulse rounded bg-slate-800/40" />
                  <div className="h-4 w-10 animate-pulse rounded bg-slate-800/30" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
