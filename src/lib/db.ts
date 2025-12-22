import "server-only";

import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { config } from "@/lib/config";

// Reuse connections between requests when the platform supports it.
neonConfig.fetchConnectionCache = true;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    `Missing DATABASE_URL. Set it in your environment (NODE_ENV=${config.env}).`,
  );
}

const sql = neon(databaseUrl);
export const db = drizzle(sql);
