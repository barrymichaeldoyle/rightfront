export const config = {
  env: process.env.NODE_ENV,
  defaultCountry: process.env.DEV_COUNTRY || "us",
  defaultLanguage: process.env.DEV_LANGUAGE || "en",
  fallbackUrlBase: "/fallback",
  enableDebugLogs: process.env.NODE_ENV === "development",
  siteUrl:
    (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "").replace(
      /\/$/,
      "",
    ) ||
    (process.env.NODE_ENV === "production"
      ? "https://rightfront.app"
      : "http://localhost:3000"),
};
