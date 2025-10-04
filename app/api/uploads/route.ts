import { NextRequest, NextResponse } from "next/server";
import { uploadImageToBlob } from "@/lib/blob";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const urls: string[] = [];

    console.log(`Processing ${files.length} files for upload`);

    for (const file of files) {
      console.log(`Uploading file: ${file.name}, size: ${file.size}`);
      // Read file as arrayBuffer then convert to base64
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const filename = `ref-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}-${file.name}`;
      const uploaded = await uploadImageToBlob(base64, filename);
      if (uploaded?.url) {
        urls.push(uploaded.url);
        console.log(`Successfully uploaded: ${filename}`);
      }
    }

    console.log(`Upload complete, returning ${urls.length} URLs`);
    return NextResponse.json({ urls });
  } catch (err) {
    console.error("Upload error", err);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}
