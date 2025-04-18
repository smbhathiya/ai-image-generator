"use server";

import { getDb } from "@/configs/drizzle";
import { Images, Users } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    const { userId } =await auth();
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

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64Image}`,
      {
        folder: "ai_generated_collection",
        public_id: `generated_${Date.now()}_${dbUser.id}`,
      }
    );

    // Save image to database
    const imageRecord = await db
      .insert(Images)
      .values({
        userId: dbUser.id,
        cloudinaryId: uploadResult.public_id,
        cloudinaryUrl: uploadResult.secure_url,
        createdAt: new Date(),
      })
      .returning();

    return {
      success: true,
      image: {
        id: imageRecord[0].id,
        cloudinaryUrl: imageRecord[0].cloudinaryUrl,
        cloudinaryId: imageRecord[0].cloudinaryId,
      },
    };
  } catch (error) {
    console.error("Error saving image:", error);
    throw new Error("Failed to save generated image");
  }
}
