"use server";

import { getDb } from "@/configs/drizzle";
import { Users } from "@/configs/schema";

export async function getUsers() {
  const db = await getDb();
  const users = await db.select().from(Users);
  return users;
}
