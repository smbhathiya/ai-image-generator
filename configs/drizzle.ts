import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

let db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (db) return db;

  const url = process.env.DRIZZLE_DATABASE_URL;
  if (!url) {
    throw new Error(
      "DRIZZLE_DATABASE_URL is not set. Set this environment variable to connect to the database."
    );
  }

  const sql = neon(url);
  db = drizzle(sql, { schema });
  return db;
}
