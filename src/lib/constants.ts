/**
 * Global constants and configuration for RightFront.
 */

export const FALLBACK_APPSTORE_COUNTRY = "us"; // used in fallback URL links
export const FALLBACK_PLAYSTORE_LANGUAGE = "en"; // for Android URLs

export const DEFAULT_COUNTRY =
  process.env.DEV_COUNTRY?.toLowerCase() || FALLBACK_APPSTORE_COUNTRY;
