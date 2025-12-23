/**
 * Hash an IP address for analytics without storing the raw IP.
 *
 * - Returns null when ip is missing/empty.
 * - Uses SHA-256 with an optional salt (IP_HASH_SALT env var).
 * - Works in both Node and Edge runtimes (uses WebCrypto).
 */
export async function hashIP(ip: string | null): Promise<string | null> {
  const raw = String(ip ?? "").trim();
  if (!raw) return null;

  const salt = String(process.env.IP_HASH_SALT ?? "");
  const toHash = `${salt}${raw}`;

  const bytes = new TextEncoder().encode(toHash);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
