import getImagesPaginated from "@/actions/getImagesPaginated";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const limit = parseInt(searchParams.get("limit") || "6", 10);

  try {
    const images = await getImagesPaginated(offset, limit);
    return NextResponse.json(images);
  } catch {
    return new NextResponse("Error loading images", { status: 500 });
  }
}
