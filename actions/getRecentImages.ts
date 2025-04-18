"use server";
import { getDb } from "@/configs/drizzle";
import { desc } from "drizzle-orm";
import { Images } from "@/configs/schema";

export async function getRecentImages() {
  const db = await getDb();
  const recentImages = await db
    .select()
    .from(Images)
    .orderBy(desc(Images.createdAt))
    .limit(6);
  return recentImages;
}

export default getRecentImages;
