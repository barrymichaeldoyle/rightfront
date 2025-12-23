/**
 * Normalize user-provided slugs into our canonical permalink format.
 * - lowercase
 * - collapse invalid characters into hyphens
 * - collapse repeated hyphens
 * - trim leading/trailing hyphens
 */
export function normalizeSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Our permalink slug rules:
 * - 3–32 chars
 * - lowercase letters/numbers
 * - hyphen-separated tokens (no leading/trailing hyphen, no consecutive hyphens)
 */
export function isValidSlug(slug: string): boolean {
  return (
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) &&
    slug.length >= 3 &&
    slug.length <= 32
  );
}
