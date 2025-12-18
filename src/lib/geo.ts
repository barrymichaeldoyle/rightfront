import { config } from "./config";

interface RequestWithGeo extends Request {
  geo?: {
    country?: string;
  };
}

export async function getCountryCode(req: Request): Promise<string> {
  // 1. Try Vercel Geo (works in production)
  const vercelCountry =
    (req as RequestWithGeo).geo?.country || req.headers.get("x-vercel-country");
  if (vercelCountry) {
    return vercelCountry.toLowerCase();
  }

  // 2. Try IP-based service (for local dev)
  const ip =
    req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || "";

  // Localhost / no IP case
  if (!ip || ip.startsWith("127.") || ip === "localhost") {
    return config.defaultCountry;
  }

  try {
    const res = await fetch(`https://ipapi.co/${ip}/country/`);
    const text = await res.text();

    // If the API responds with clear rate-limit or JSON, ignore and default
    if (!/^[A-Z]{2}$/i.test(text.trim())) {
      return config.defaultCountry;
    }

    return text.trim().toLowerCase();
  } catch {
    // 3. Fall back cleanly
    return config.defaultCountry;
  }
}
