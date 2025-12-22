"use client";

import { useMemo, useState, useTransition } from "react";

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
  deleteAction,
}: {
  links: LinkRow[];
  siteUrl: string;
  deleteAction: (formData: FormData) => Promise<void>;
}) {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
        return (
          <div
            key={link.id}
            className="flex items-center justify-between gap-4 px-4 py-3 transition hover:bg-slate-900/40"
          >
            <div className="min-w-0">
              <a
                href={permalink}
                className="block truncate font-mono text-sm text-sky-300 underline-offset-4 hover:text-sky-200 hover:underline"
              >
                /p/{link.slug}
              </a>
              <p className="mt-0.5 text-xs text-slate-400">
                <span className="font-mono text-slate-300">{link.appId}</span> •{" "}
                {link.platform.toUpperCase()} • {link.clicks} clicks • Created{" "}
                {link.createdAt}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={() => handleCopy(link.slug)}
                className="cursor-pointer text-sm text-sky-300 underline-offset-4 hover:text-sky-200 hover:underline"
              >
                {copiedSlug === link.slug ? "Copied" : "Copy"}
              </button>

              <form
                action={(formData) => {
                  startTransition(async () => {
                    await deleteAction(formData);
                  });
                }}
              >
                <input type="hidden" name="id" value={link.id} />
                <button
                  type="submit"
                  disabled={isPending}
                  className="cursor-pointer text-sm text-slate-400 transition hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
}
