import getUserRecentImages from "@/actions/getUserRecentImages";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const images = await getUserRecentImages();
    return NextResponse.json({ images });
  } catch (error) {
    console.error("Failed to get recent images:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent images" },
      { status: 500 }
    );
  }
}
