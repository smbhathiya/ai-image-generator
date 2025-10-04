"use server";

import { eq } from "drizzle-orm";
import { deleteImageFromBlob } from "@/lib/blob";
import { Images } from "@/configs/schema";
import { getDb } from "@/configs/drizzle";

export async function deleteImageAction(id: number, blobUrl: string) {
  const db = await getDb();
  if (!id || !blobUrl) {
    throw new Error("Missing required params");
  }

  try {
    await deleteImageFromBlob(blobUrl);
    await db.delete(Images).where(eq(Images.id, id));
  } catch (error) {
    console.error("Server action delete error:", error);
    throw new Error("Failed to delete image");
  }
}
