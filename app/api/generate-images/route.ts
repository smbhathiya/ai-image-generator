import { GoogleGenAI, Modality } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

interface PromptRequest {
  prompt: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: PromptRequest = await req.json();
    const { prompt } = body;

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: geminiApiKey });

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const parts = result.candidates?.[0]?.content?.parts || [];

    let textOutput = "";
    let imageBase64 = "";

    for (const part of parts) {
      if (part.text) textOutput += part.text;
      else if (part.inlineData) imageBase64 = part.inlineData.data ?? "";
    }

    return NextResponse.json({ text: textOutput, image: imageBase64 });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
