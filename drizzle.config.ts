import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.Local" });

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.PUBLIC_DRIZZLE_DATABASE_URL!,
  },
});
