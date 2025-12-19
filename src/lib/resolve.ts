import { config } from "./config";

type ResolveAppUrlParams =
  | {
      appId: string;
      store: "ios";
      country: string;
    }
  | {
      appId: string;
      store: "android";
      country: string;
      language?: string;
    };

export async function resolveAppUrl(params: ResolveAppUrlParams) {
  const gl = params.country.toUpperCase();
  if (params.store === "ios") {
    const appleCountry = params.country.toLowerCase();
    const url = `https://apps.apple.com/${appleCountry}/app/${params.appId}`;
    const head = await fetch(url, { method: "HEAD" });
    return head.ok ? url : null;
  }

  if (params.store === "android") {
    const hl = (params.language || config.defaultLanguage).toLowerCase();
    return `https://play.google.com/store/apps/details?id=${params.appId}&hl=${hl}&gl=${gl}`;
  }

  return null;
}
