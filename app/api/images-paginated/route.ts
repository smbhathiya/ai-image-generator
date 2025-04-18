import getImagesPaginated from "@/actions/getImagesPaginated";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const limit = parseInt(searchParams.get("limit") || "6", 10);

  console.log("Fetching paginated images with", { offset, limit });

  try {
    const images = await getImagesPaginated(offset, limit);
    console.log("Returned images:", images);
    return NextResponse.json(images);
  } catch (error) {
    console.error("Failed to get paginated images:", error);
    return new NextResponse("Error loading images", { status: 500 });
  }
}
