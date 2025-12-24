"use client";

import { useMemo, useState } from "react";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";

type AnchorHeadingProps = {
  id: string;
  as?: "h1" | "h2";
  className?: string;
  children: ReactNode;
};

function LinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M10 13a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0 0-7.07 5 5 0 0 0-7.07 0L10.5 5.4" />
      <path d="M14 11a5 5 0 0 0-7.07 0L5.52 12.4a5 5 0 0 0 0 7.07 5 5 0 0 0 7.07 0L13.5 18.6" />
    </svg>
  );
}

function getBaseUrlWithHash(id: string) {
  const url = new URL(window.location.href);
  url.hash = id;
  return url.toString();
}

export function AnchorHeading({
  id,
  as = "h2",
  className,
  children,
}: AnchorHeadingProps) {
  const [copied, setCopied] = useState(false);

  const tooltipText = useMemo(
    () => (copied ? "Copied!" : "Copy link to section"),
    [copied],
  );

  const Tag = as;
  const baseClasses =
    as === "h1"
      ? "group scroll-mt-24 text-4xl font-extrabold tracking-tight"
      : "group mb-4 scroll-mt-24 text-2xl font-semibold";

  function handleAnchorClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Allow normal browser behavior for modified clicks (new tab, etc).
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    // Let the browser update the hash naturally; keep it smooth.
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    try {
      window.history.replaceState(null, "", `#${id}`);
    } catch {
      // ignore
    }
  }

  async function handleCopyClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    const url = getBaseUrlWithHash(id);

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      window.prompt("Copy link:", url);
    }
  }

  return (
    <Tag
      id={id}
      className={`${baseClasses}${className ? ` ${className}` : ""}`}
    >
      <span className="inline-flex items-center gap-2">
        <a
          href={`#${id}`}
          onClick={handleAnchorClick}
          className="rounded decoration-transparent underline-offset-4 hover:text-slate-50 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
        >
          {children}
        </a>

        {/* Copy button (icon + tooltip). Does NOT navigate. */}
        <span className="group/copy relative inline-flex">
          <Button
            type="button"
            onClick={handleCopyClick}
            aria-label={tooltipText}
            variant="ghost"
            size="iconXs"
            className="rounded opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>

          <span
            className={`pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[calc(100%+8px)] rounded bg-slate-950 px-2 py-1 text-xs font-medium whitespace-nowrap text-slate-100 shadow-lg ring-1 ring-slate-800 transition-opacity ${
              copied ? "opacity-100" : "opacity-0 group-hover/copy:opacity-100"
            }`}
          >
            {tooltipText}
          </span>
        </span>
      </span>
    </Tag>
  );
}
