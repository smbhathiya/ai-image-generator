import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const sql = neon(process.env.NEXT_PUBLIC_DRIZZLE_DATABASE_URL || "");
export const db = drizzle(sql, { schema });
