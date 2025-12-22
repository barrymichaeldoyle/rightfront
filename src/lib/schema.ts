import {
  integer,
  pgTable,
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
  (t) => ({
    slugUnique: uniqueIndex("user_links_slug_unique").on(t.slug),
  }),
);
