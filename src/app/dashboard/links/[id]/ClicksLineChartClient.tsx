"use client";

import { useMemo, useRef, useState } from "react";

import { cn } from "@/lib/cn";

export type ClickPoint = {
  /** Short label used on axis (e.g. "12:00" or "2025-12-24") */
  xLabel: string;
  /** Full label shown in tooltip */
  tooltipLabel: string;
  count: number;
};

export function ClicksLineChartClient({
  title,
  subtitle,
  points,
}: {
  title: string;
  subtitle: string;
  points: ClickPoint[];
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState<{
    idx: number;
    x: number;
    y: number;
  } | null>(null);

  const max = useMemo(
    () => Math.max(1, ...points.map((p) => p.count)),
    [points],
  );

  const W = 520;
  const H = 200;
  const padX = 18;
  const padY = 18;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;

  const coords = useMemo(() => {
    const n = points.length;
    const denom = Math.max(1, n - 1);
    return points.map((p, i) => {
      const x = padX + (i / denom) * innerW;
      const y = padY + (1 - p.count / max) * innerH;
      return { x, y };
    });
  }, [points, innerW, innerH, max]);

  const { solidPathD, dashedPathD } = useMemo(() => {
    const n = coords.length;
    if (n === 0) return { solidPathD: "", dashedPathD: "" };
    if (n === 1) {
      const c = coords[0];
      return {
        solidPathD: `M ${c.x.toFixed(2)} ${c.y.toFixed(2)}`,
        dashedPathD: "",
      };
    }

    const solidCoords = coords.slice(0, Math.max(1, n - 1));
    const solidPathD = solidCoords
      .map(
        (c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(2)} ${c.y.toFixed(2)}`,
      )
      .join(" ");

    const a = coords[n - 2];
    const b = coords[n - 1];
    const dashedPathD = `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} L ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;

    return { solidPathD, dashedPathD };
  }, [coords]);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-100">{title}</p>
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-slate-400">Total</p>
          <p className="font-mono text-sm text-slate-200">
            {points.reduce((a, p) => a + p.count, 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div ref={ref} className="relative mt-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-44 w-full overflow-visible"
          role="img"
          aria-label={`${title} line chart`}
        >
          {/* gridline */}
          <line
            x1={padX}
            x2={W - padX}
            y1={H - padY}
            y2={H - padY}
            stroke="rgba(148,163,184,0.18)"
            strokeWidth="1"
          />

          {/* line */}
          <path
            d={solidPathD}
            fill="none"
            stroke="rgba(56,189,248,0.95)" /* sky-400-ish */
            strokeWidth="2.25"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {dashedPathD ? (
            <path
              d={dashedPathD}
              fill="none"
              stroke="rgba(56,189,248,0.95)"
              strokeWidth="2.25"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray="5 4"
              opacity="0.9"
            />
          ) : null}

          {/* hover crosshair */}
          {hover ? (
            <line
              x1={coords[hover.idx]?.x ?? 0}
              x2={coords[hover.idx]?.x ?? 0}
              y1={padY}
              y2={H - padY}
              stroke="rgba(148,163,184,0.22)"
              strokeWidth="1"
            />
          ) : null}

          {/* points */}
          {coords.map((c, idx) => {
            const p = points[idx];
            const active = hover?.idx === idx;
            return (
              <g key={`${idx}-${p.xLabel}`}>
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={active ? 4 : 3}
                  fill={active ? "rgba(56,189,248,1)" : "rgba(56,189,248,0.85)"}
                  stroke="rgba(2,6,23,0.9)"
                  strokeWidth="1.5"
                />
                <circle
                  cx={c.x}
                  cy={c.y}
                  r="10"
                  fill="transparent"
                  onMouseEnter={(e) => {
                    const box = ref.current?.getBoundingClientRect();
                    if (!box) return;
                    setHover({
                      idx,
                      x: e.clientX - box.left,
                      y: e.clientY - box.top,
                    });
                  }}
                  onMouseMove={(e) => {
                    const box = ref.current?.getBoundingClientRect();
                    if (!box) return;
                    setHover((h) =>
                      h && h.idx === idx
                        ? {
                            idx,
                            x: e.clientX - box.left,
                            y: e.clientY - box.top,
                          }
                        : {
                            idx,
                            x: e.clientX - box.left,
                            y: e.clientY - box.top,
                          },
                    );
                  }}
                  onMouseLeave={() => setHover(null)}
                />
              </g>
            );
          })}
        </svg>

        {hover ? (
          <div
            className={cn(
              "pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-md bg-slate-950 px-2.5 py-2 text-[11px] leading-snug text-slate-100 shadow-lg ring-1 ring-slate-800",
            )}
            style={{
              left: hover.x,
              top: hover.y,
              maxWidth: 240,
            }}
          >
            <div className="font-medium text-slate-100">
              {points[hover.idx]?.count.toLocaleString()} clicks
            </div>
            <div className="mt-0.5 font-mono text-slate-300">
              {points[hover.idx]?.tooltipLabel}
            </div>
          </div>
        ) : null}

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
          <span>{points[0]?.xLabel ?? ""}</span>
          <span>{points.at(-1)?.xLabel ?? ""}</span>
        </div>
      </div>
    </div>
  );
}
