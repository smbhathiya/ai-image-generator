import { deleteImageAction } from "@/actions/deleteImageAction";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { id, cloudinaryId } = await req.json();

  if (!id || !cloudinaryId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    await deleteImageAction(id, cloudinaryId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
