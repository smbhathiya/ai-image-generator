import {
  pgTable,
  serial,
  varchar,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  imageUrl: varchar("imageUrl", { length: 512 }),
  subscription: boolean("subscription").default(false),
});

export const Images = pgTable("images", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => Users.id),
  cloudinaryId: varchar("cloudinary_id", { length: 255 }).notNull(),
  cloudinaryUrl: varchar("cloudinary_url", { length: 512 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

