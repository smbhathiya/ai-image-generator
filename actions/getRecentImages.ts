"use server";
import { getDb } from "@/configs/drizzle";
import { desc } from "drizzle-orm";
import { Images } from "@/configs/schema";
import { auth } from "@clerk/nextjs/server";

export async function getRecentImages() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const db = await getDb();
  const recentImages = await db
    .select()
    .from(Images)
    .orderBy(desc(Images.createdAt))
    .limit(6);
  return recentImages;
}

export default getRecentImages;
