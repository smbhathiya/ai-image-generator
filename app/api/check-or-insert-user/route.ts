import { NextResponse } from "next/server";
import { checkOrInsertUser } from "@/actions/userActions";

export async function POST(request: Request) {
  try {
    const { name, email, imageUrl } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const result = await checkOrInsertUser({ name, email, imageUrl });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
