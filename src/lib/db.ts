import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { config } from "@/lib/config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    `Missing DATABASE_URL. Set it in your environment (NODE_ENV=${config.env}).`,
  );
}

const sql = neon(databaseUrl);
export const db = drizzle(sql);
