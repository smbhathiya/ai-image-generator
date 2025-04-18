"use server";

import { getDb } from "@/configs/drizzle";
import { desc } from "drizzle-orm";
import { Images } from "@/configs/schema";

export async function getImagesPaginated(offset = 0, limit = 6) {
  const db = await getDb();

  const images = await db
    .select()
    .from(Images)
    .orderBy(desc(Images.createdAt))
    .offset(offset)
    .limit(limit);

  return images;
}

export default getImagesPaginated;
