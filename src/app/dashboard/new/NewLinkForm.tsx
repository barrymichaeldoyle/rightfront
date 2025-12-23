"use client";

import { useActionState, useMemo, useState } from "react";

import type { CreateLinkState } from "@/lib/linkStates";

const initialState: CreateLinkState = { ok: false, error: "" };

export function NewLinkForm({
  action,
}: {
  action: (
    prevState: CreateLinkState,
    formData: FormData,
  ) => Promise<CreateLinkState>;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [copied, setCopied] = useState(false);

  const permalink = state.ok ? state.permalink : state.permalink;

  const permalinkHostless = useMemo(() => {
    if (!permalink) return null;
    try {
      const u = new URL(permalink);
      return `${u.pathname}${u.search}${u.hash}`;
    } catch {
      return permalink;
    }
  }, [permalink]);

  async function handleCopy() {
    if (!permalink) return;
    try {
      await navigator.clipboard.writeText(permalink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }

  return (
    <div className="grid gap-4">
      <form
        action={formAction}
        className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-1">
            <label className="text-sm font-medium text-slate-200">
              iOS App Store ID
            </label>
            <input
              name="appId"
              placeholder="e.g. id284882215"
              required
              className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950/40 p-2 font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            />
            <p className="mt-2 text-xs text-slate-400">
              Must start with <span className="font-mono">id</span> followed by
              digits.
            </p>
          </div>

          <div className="md:col-span-1">
            <label className="text-sm font-medium text-slate-200">
              Permalink slug
            </label>
            <input
              name="slug"
              placeholder="e.g. spotify"
              required
              className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950/40 p-2 font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            />
            <p className="mt-2 text-xs text-slate-400">
              Lowercase letters, numbers, and hyphens only.
            </p>
          </div>
        </div>

        {state.ok ? null : state.error ? (
          <div className="mt-4 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {state.error}
          </div>
        ) : null}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-sky-400 hover:to-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Creating…" : "Create permalink"}
          </button>
          <p className="text-xs text-slate-400">
            Creates{" "}
            <span className="font-mono">{permalinkHostless ?? "/p/…"}</span>
          </p>
        </div>
      </form>

      {state.ok ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5">
          <p className="text-sm font-semibold text-slate-100">
            Permalink created
          </p>
          <p className="mt-1 text-sm text-slate-300">
            Share this URL (it will geo-route via the same logic as{" "}
            <span className="font-mono">/link?id=…</span>):
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <a
              href={state.permalink}
              className="truncate rounded-md border border-slate-700 bg-slate-950/40 px-3 py-2 font-mono text-sm text-sky-300 underline-offset-4 hover:underline"
            >
              {state.permalink}
            </a>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
