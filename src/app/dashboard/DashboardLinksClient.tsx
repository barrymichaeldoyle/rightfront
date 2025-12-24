"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { CopyIcon } from "@/components/icons/CopyIcon";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { SettingsIcon } from "@/components/icons/SettingsIcon";
import { Button, ButtonAnchor, ButtonLink } from "@/components/ui/Button";

type LinkRow = {
  id: string;
  slug: string;
  appId: string;
  platform: string;
  clicks: number;
  createdAt: string;
};

export function DashboardLinksClient({
  links,
  siteUrl,
}: {
  links: LinkRow[];
  siteUrl: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [navigatingId, setNavigatingId] = useState<string | null>(null);

  const rows = useMemo(() => links, [links]);

  async function handleCopy(slug: string) {
    const url = `${siteUrl}/p/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug((s) => (s === slug ? null : s)), 1200);
    } catch {
      // ignore
    }
  }

  return (
    <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900/20">
      {rows.map((link) => {
        const permalink = `${siteUrl}/p/${link.slug}`;
        const manageHref = `/dashboard/links/${link.id}`;
        const isNavigatingThis = isPending && navigatingId === link.id;
        return (
          <div
            key={link.id}
            className="flex items-center justify-between gap-4 px-4 py-3 transition hover:bg-slate-900/40"
          >
            <div className="min-w-0">
              <ButtonAnchor
                href={permalink}
                target="_blank"
                rel="noopener noreferrer"
                variant="link"
                size="sm"
                aria-label={`Open /p/${link.slug} in a new tab`}
                className="min-w-0 justify-start font-mono"
              >
                <ExternalLinkIcon className="h-4 w-4 shrink-0 opacity-90" />
                <span className="min-w-0 truncate">/p/{link.slug}</span>
              </ButtonAnchor>
              <p className="mt-0.5 text-xs text-slate-400">
                <span className="font-mono text-slate-300">{link.appId}</span> •{" "}
                {link.platform.toUpperCase()} • {link.clicks} clicks • Created{" "}
                {link.createdAt}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <Button
                type="button"
                onClick={() => handleCopy(link.slug)}
                variant="secondary"
                size="sm"
              >
                <CopyIcon className="h-4 w-4" />
                {copiedSlug === link.slug ? "Copied" : "Copy"}
              </Button>

              <ButtonLink
                href={manageHref}
                prefetch
                variant="secondary"
                size="sm"
                aria-busy={isNavigatingThis}
                onMouseEnter={() => router.prefetch(manageHref)}
                onFocus={() => router.prefetch(manageHref)}
                onClick={(e) => {
                  // Allow normal browser behavior for modified clicks (new tab, etc).
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
                  setNavigatingId(link.id);
                  startTransition(() => router.push(manageHref));
                }}
              >
                <SettingsIcon className="h-4 w-4" />
                <span>{isNavigatingThis ? "Loading…" : "Manage"}</span>
                <span
                  aria-hidden="true"
                  className={`h-4 w-4 shrink-0 rounded-full border-2 border-current/30 border-t-current ${
                    isNavigatingThis ? "animate-spin opacity-100" : "opacity-0"
                  }`}
                />
              </ButtonLink>
            </div>
          </div>
        );
      })}
    </div>
  );
}
