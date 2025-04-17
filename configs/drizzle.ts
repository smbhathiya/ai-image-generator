import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const sql = neon(process.env.DRIZZLE_DATABASE_URL || "");
const db = drizzle(sql, { schema });

export async function getDb() {
  return db;
}
