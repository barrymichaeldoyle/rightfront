"use client";

import { useActionState, useMemo, useState, useTransition } from "react";

import type { UpdateLinkState } from "@/lib/linkStates";

const initialState: UpdateLinkState = { ok: false, error: "" };

export function LinkSettingsForm({
  linkId,
  initialSlug,
  initialAppId,
  initialPlatform,
  siteUrl,
  updateAction,
  deleteAction,
}: {
  linkId: string;
  initialSlug: string;
  initialAppId: string;
  initialPlatform: string;
  siteUrl: string;
  updateAction: (
    prevState: UpdateLinkState,
    formData: FormData,
  ) => Promise<UpdateLinkState>;
  deleteAction: (formData: FormData) => Promise<void>;
}) {
  const [state, formAction, isPending] = useActionState(updateAction, {
    ...initialState,
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, startDeleting] = useTransition();

  const permalink = useMemo(() => {
    if (state.ok) return state.permalink;
    return `${siteUrl}/p/${initialSlug}`;
  }, [initialSlug, siteUrl, state]);

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5">
        <p className="text-sm font-semibold text-slate-100">Permalink</p>
        <a
          href={permalink}
          className="mt-2 block truncate rounded-md border border-slate-700 bg-slate-950/40 px-3 py-2 font-mono text-sm text-sky-300 underline-offset-4 hover:underline"
        >
          {permalink}
        </a>
        <p className="mt-2 text-xs text-slate-400">
          Platform:{" "}
          <span className="font-mono text-slate-300">{initialPlatform}</span>
        </p>
      </div>

      <form
        action={formAction}
        className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5"
      >
        <input type="hidden" name="id" value={linkId} />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-200">App ID</label>
            <input
              name="appId"
              defaultValue={initialAppId}
              required
              className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950/40 p-2 font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            />
            <p className="mt-2 text-xs text-slate-400">
              iOS: <span className="font-mono">id123…</span> • Android:{" "}
              <span className="font-mono">com.example.app</span>
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-200">Slug</label>
            <input
              name="slug"
              defaultValue={initialSlug}
              required
              className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950/40 p-2 font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            />
            <p className="mt-2 text-xs text-slate-400">
              3–32 chars, lowercase letters/numbers, hyphens only.
            </p>
          </div>
        </div>

        {state.ok ? (
          <div className="mt-4 rounded-lg border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            Saved.
          </div>
        ) : state.error ? (
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
            {isPending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-5">
        <p className="text-sm font-semibold text-red-200">Danger zone</p>
        <p className="mt-1 text-sm text-red-200/80">
          Deleting a link can’t be undone.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 text-sm text-red-100/90">
            <input
              type="checkbox"
              checked={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.checked)}
              className="h-4 w-4 rounded border border-red-200/40 bg-transparent"
            />
            I understand, delete this link
          </label>

          <form
            action={(formData) => {
              if (!confirmDelete) return;
              startDeleting(async () => {
                await deleteAction(formData);
              });
            }}
          >
            <input type="hidden" name="id" value={linkId} />
            <button
              type="submit"
              disabled={!confirmDelete || isDeleting}
              className="cursor-pointer rounded-md border border-red-300/30 bg-red-950 px-4 py-2 text-sm font-semibold text-red-100 transition hover:brightness-120 focus-visible:ring-2 focus-visible:ring-red-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? "Deleting…" : "Delete link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
