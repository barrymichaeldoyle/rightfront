import { config } from "./config";

interface LanguageCandidate {
  lang: string;
  q: number;
}

/**
 * Parses an Accept-Language header and returns a Play Store-compatible
 * primary language subtag (e.g. "en", "de", "fr").
 *
 * - Respects q-values
 * - Returns only the primary subtag
 * - Falls back safely
 */
export function getLanguageCodeFromAcceptLanguage(
  acceptLanguage: string | null,
  fallback: string = config.defaultLanguage,
): string {
  if (!acceptLanguage) return fallback;

  const candidates: LanguageCandidate[] = [];

  for (const part of acceptLanguage.split(",")) {
    const [tagPart, ...params] = part.trim().split(";");

    if (!tagPart) continue;

    const primary = tagPart.split("-")[0]?.trim().toLowerCase();

    if (!primary || !/^[a-z]{2,3}$/.test(primary)) continue;

    let q = 1;
    for (const param of params) {
      const match = param.trim().match(/^q=([0-9.]+)$/);
      if (match) {
        const parsed = Number(match[1]);
        if (!Number.isNaN(parsed)) q = parsed;
      }
    }

    candidates.push({ lang: primary, q });
  }

  if (candidates.length === 0) return fallback;

  candidates.sort((a, b) => b.q - a.q);

  return candidates[0].lang || fallback;
}
