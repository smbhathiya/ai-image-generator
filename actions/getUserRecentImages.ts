"use server";
import { getDb } from "@/configs/drizzle";
import { desc, eq } from "drizzle-orm";
import { Images, Users } from "@/configs/schema";
import { auth } from "@clerk/nextjs/server";

export async function getUserRecentImages() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const db = await getDb();

  const userRecentImages = await db
    .select({
      id: Images.id,
      cloudinaryId: Images.cloudinaryId,
      cloudinaryUrl: Images.cloudinaryUrl,
      createdAt: Images.createdAt,
    })
    .from(Images)
    .innerJoin(Users, eq(Users.id, Images.userId))
    .where(eq(Users.clerkId, userId))
    .orderBy(desc(Images.createdAt))
    .limit(6);

  return userRecentImages;
}

export default getUserRecentImages;
