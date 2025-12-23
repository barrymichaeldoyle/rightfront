export type CreateLinkState =
  | { ok: false; error: string; permalink?: string; slug?: string }
  | { ok: true; error?: string; permalink: string; slug: string };

export type UpdateLinkState =
  | { ok: false; error: string }
  | { ok: true; error?: string; permalink: string };
