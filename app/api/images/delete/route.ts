import { deleteImageAction } from "@/actions/deleteImageAction";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { id, blobUrl } = await req.json();

  if (!id || !blobUrl) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    await deleteImageAction(id, blobUrl);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
