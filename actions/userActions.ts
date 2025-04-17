"use server";

import { getDb } from "@/configs/drizzle";
import { Users } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function checkOrInsertUser({
  name,
  email,
  imageUrl,
}: {
  name?: string;
  email: string;
  imageUrl?: string;
}) {
  if (!email) {
    throw new Error("Email is required");
  }

  try {
    const db = await getDb();
    const result = await db.select().from(Users).where(eq(Users.email, email));

    console.log("DB Query result:", result);

    if (result.length === 0) {
      console.log("Inserting new user");
      await db.insert(Users).values({
        name: name ?? "",
        email,
        imageUrl: imageUrl ?? "",
      });
    }

    return { success: true };
  } catch (error) {
    throw new Error("Failed to check or insert user");
  }
}
