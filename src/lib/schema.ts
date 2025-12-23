import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const userLinks = pgTable(
  "user_links",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(), // public permalink identifier (e.g. "spotify")
    userId: text("user_id").notNull(), // Clerk userId
    appId: text("app_id").notNull(),
    platform: text("platform").notNull(),
    clicks: integer("clicks").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [uniqueIndex("user_links_slug_unique").on(t.slug)],
);

export const linkEvents = pgTable("link_events", {
  id: serial("id").primaryKey(),

  // Context
  linkId: text("link_id").notNull(), // which userLink record
  userId: text("user_id").notNull(), // owner (Clerk)
  appId: text("app_id").notNull(), // iOS/Android ID for convenience

  // Source intelligence
  ipHash: text("ip_hash"), // hashed IP for uniqueness/geo approx
  country: text("country"),
  region: text("region"), // optional: e.g. US‑CA
  city: text("city"),
  userAgent: text("user_agent"),
  referrer: text("referrer"), // <meta> or email campaign source
  deviceType: text("device_type"), // e.g. iPhone, Android, Desktop
  os: text("os"), // e.g. iOS 18, Android 15, Windows
  browser: text("browser"), // e.g. Safari, Chrome, Edge

  // Outcome / routing
  platformDetected: text("platform_detected"), // ios/android/unknown/etc.
  routedStorefront: text("routed_storefront"), // full URL where redirected
  storeRegion: text("store_region"), // apple country (us/jp/de)
  usedFallback: boolean("used_fallback").default(false), // fallback triggered?
  fallbackReason: text("fallback_reason"), // not available / invalid app
  success: boolean("success").default(true), // false = failed redirect / invalid link

  // Timing
  createdAt: timestamp("created_at").defaultNow(),
});
