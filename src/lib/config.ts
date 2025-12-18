export const config = {
  env: process.env.NODE_ENV,
  defaultCountry: process.env.DEV_COUNTRY || "us",
  fallbackUrlBase: "/fallback",
  enableDebugLogs: process.env.NODE_ENV === "development",
};
