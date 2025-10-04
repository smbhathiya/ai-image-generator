"use server";

import { getDb } from "@/configs/drizzle";
import { Images, Users } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { uploadImageToBlob } from "@/lib/blob";
import { auth } from "@clerk/nextjs/server";

interface SaveImageParams {
  base64Image: string;
  prompt: string;
}

export async function saveGeneratedImage({
  base64Image,
  prompt,
}: SaveImageParams) {
  try {
    // Get Clerk user ID
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const db = await getDb();

    // Get user from database using Clerk ID
    const userResult = await db
      .select()
      .from(Users)
      .where(eq(Users.clerkId, userId));

    if (userResult.length === 0) {
      throw new Error("User not found in database");
    }

    const dbUser = userResult[0];

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `ai_generated_${timestamp}_${dbUser.id}.png`;

    // Upload image to Vercel Blob
    const uploadResult = await uploadImageToBlob(base64Image, filename);

    // Save image to database
    const imageRecord = await db
      .insert(Images)
      .values({
        userId: dbUser.id,
        blobUrl: uploadResult.url,
        prompt: prompt,
        createdAt: new Date(),
      })
      .returning();

    return {
      success: true,
      image: {
        id: imageRecord[0].id,
        blobUrl: imageRecord[0].blobUrl,
        prompt: imageRecord[0].prompt,
      },
    };
  } catch (error) {
    console.error("Error saving image:", error);
    throw new Error("Failed to save generated image");
  }
}
