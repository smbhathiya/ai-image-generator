"use server";

import { eq } from "drizzle-orm";
import cloudinary from "@/lib/cloudinary";
import { Images } from "@/configs/schema";
import { getDb } from "@/configs/drizzle";

export async function deleteImageAction(id: number, cloudinaryId: string) {
  const db = await getDb();
  if (!id || !cloudinaryId) {
    throw new Error("Missing required params");
  }

  try {
    await cloudinary.uploader.destroy(cloudinaryId);
    await db.delete(Images).where(eq(Images.id, id));
  } catch (error) {
    console.error("Server action delete error:", error);
    throw new Error("Failed to delete image");
  }
}
