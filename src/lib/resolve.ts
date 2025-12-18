interface ResolveAppUrlParams {
  appId: string;
  store: "ios" | "android";
  country: string;
}

export async function resolveAppUrl({
  appId,
  store,
  country,
}: ResolveAppUrlParams) {
  if (store === "ios") {
    const url = `https://apps.apple.com/${country}/app/${appId}`;
    const head = await fetch(url, { method: "HEAD" });
    return head.ok ? url : null;
  }

  if (store === "android") {
    const url = `https://play.google.com/store/apps/details?id=${appId}&hl=${country}`;
    const head = await fetch(url, { method: "HEAD" });
    return head.ok ? url : null;
  }

  return null;
}
