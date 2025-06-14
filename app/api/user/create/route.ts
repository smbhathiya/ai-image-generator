import { NextResponse } from "next/server";
import { checkOrInsertUser } from "@/actions/userActions";

export async function POST(request: Request) {
  try {
    const { clerkId, name, email, imageUrl } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const result = await checkOrInsertUser({ clerkId, name, email, imageUrl });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
