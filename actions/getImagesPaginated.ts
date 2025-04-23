"use server";

import { getDb } from "@/configs/drizzle";
import { desc, sql } from "drizzle-orm";
import { Images } from "@/configs/schema";

export type Images = typeof Images.$inferSelect;
export type PaginatedImagesResult = {
  images: Images[];
  totalCount: number;
};

export async function getImagesPaginated(
  offset = 0,
  limit = 10
): Promise<PaginatedImagesResult> {
  try {
    const db = await getDb();

    const images = await db
      .select()
      .from(Images)
      .orderBy(desc(Images.createdAt))
      .offset(offset)
      .limit(limit);

    const totalCountResult = await db
      .select({ count: sql`count(*)` })
      .from(Images);

    const totalCount = Number(totalCountResult[0].count) || 0;

    return {
      images,
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching paginated images:", error);
    throw new Error("Failed to fetch images");
  }
}
