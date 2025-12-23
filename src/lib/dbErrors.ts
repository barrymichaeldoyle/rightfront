export type DbErrorMessageContext = "create_permalink" | "save_changes";

export function dbErrorToUserMessage(
  err: unknown,
  slug: string,
  ctx: DbErrorMessageContext,
): string {
  const e = err as { code?: string; message?: string; cause?: unknown };
  const message = String(e?.message ?? "");
  const causeMessage =
    e?.cause && typeof e.cause === "object" && "message" in e.cause
      ? String((e.cause as { message?: unknown }).message ?? "")
      : "";
  const combined = `${message}\n${causeMessage}`.toLowerCase();

  // Postgres unique violation
  if (
    e?.code === "23505" ||
    combined.includes("duplicate key value") ||
    combined.includes("unique constraint") ||
    combined.includes("user_links_slug_unique")
  ) {
    return `That slug is already taken: "${slug}". Try another (e.g. "${slug}-2").`;
  }

  // Missing table / migrations not applied
  if (
    e?.code === "42P01" ||
    combined.includes('relation "user_links" does not exist') ||
    combined.includes("does not exist") ||
    combined.includes("undefined_table")
  ) {
    return "Your database isn't initialized yet (missing table `user_links`). Run your Drizzle migrations, then try again.";
  }

  // Connectivity / env issues
  if (
    combined.includes("fetch failed") ||
    combined.includes("ecconn") ||
    combined.includes("econn") ||
    combined.includes("timeout") ||
    combined.includes("could not parse the http request body")
  ) {
    return "Couldn’t reach the database. Double-check `DATABASE_URL` and that Neon is reachable, then try again.";
  }

  return ctx === "create_permalink"
    ? "Could not create permalink due to a server error. Please try again in a moment."
    : "Could not save changes due to a server error. Please try again in a moment.";
}
