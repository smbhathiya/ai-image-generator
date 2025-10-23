import { GoogleGenAI, Modality } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

interface PromptRequest {
  prompt: string;
  images?: string[]; // base64 encoded images
  mimeTypes?: string[]; // corresponding MIME types for images
}

function buildEnhancedPrompt(prompt: string, referenceCount: number): string {
  const trimmed = prompt.trim();
  const baseInstruction =
    "Create one ultra high-resolution image (8K quality or higher) with exceptional detail, sharp focus, professional lighting, and photorealistic textures. Use maximum quality settings.";
  const referenceInstruction = referenceCount
    ? `Study and incorporate the visual style, composition techniques, color palette, and artistic elements from the ${referenceCount} provided reference image${
        referenceCount > 1 ? "s" : ""
      } while creating an original interpretation.`
    : "Create an original composition using your full creative capabilities.";
  const qualityConstraints =
    "Requirements: Ultra-sharp details, no compression artifacts, balanced exposure, rich colors, professional-grade output. Return the highest quality image possible.";

  return [
    baseInstruction,
    referenceInstruction,
    qualityConstraints,
    `User's creative vision: ${trimmed}`,
  ].join("\n\n");
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: PromptRequest = await req.json();
    const { prompt, images, mimeTypes } = body;

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required to generate an image." },
        { status: 400 }
      );
    }

    // Prefer the new Nano Banana API key, fall back to Gemini for compatibility
    const nanoBananaKey = process.env.NANO_BANANA_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const usedKeyName = nanoBananaKey
      ? "NANO_BANANA_API_KEY"
      : geminiKey
      ? "GEMINI_API_KEY"
      : null;
    const apiKey = nanoBananaKey || geminiKey || null;

    if (!apiKey) {
      console.error(
        "No AI API key configured. Check NANO_BANANA_API_KEY or GEMINI_API_KEY env vars."
      );
      return NextResponse.json(
        {
          error:
            "API key not found. Set NANO_BANANA_API_KEY or GEMINI_API_KEY.",
        },
        { status: 500 }
      );
    }

    // Log which key name we're using (don't log actual key value)
    console.info(`Using AI API key from: ${usedKeyName}`);

    // Allow overriding the model via env var for testing new models (e.g. nano-banana)
    const modelName =
      process.env.IMAGE_MODEL || "gemini-2.0-flash-exp-image-generation";
    console.info(`Using AI model: ${modelName}`);

    const ai = new GoogleGenAI({ apiKey });

    let result;
    try {
      // Create contents array with text prompt and images
      const enhancedPrompt = buildEnhancedPrompt(prompt, images?.length ?? 0);
      const contents: Array<{
        text?: string;
        inlineData?: { mimeType: string; data: string };
      }> = [{ text: enhancedPrompt }];

      // Add images if provided
      if (images && images.length > 0) {
        console.log(
          `Including ${images.length} reference images in generation`
        );
        images.forEach((base64Image, index) => {
          const mimeType = mimeTypes?.[index] || "image/png"; // Use provided MIME type or default to PNG
          console.log(
            `Adding reference image ${index + 1} with MIME type: ${mimeType}`
          );
          contents.push({
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          });
        });
        console.log(
          `Total content items: ${contents.length} (1 text + ${images.length} images)`
        );
      } else {
        console.log("No reference images provided");
      }

      result = await ai.models.generateContent({
        model: modelName,
        contents: contents,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });
    } catch (err: unknown) {
      // Surface provider error details safely for development
      // err may be an Error with response, or any other shape coming from SDK
      let providerBody: unknown = String(err);
      try {
        const errAny = err as unknown as {
          response?: { data?: unknown };
          message?: unknown;
        };
        const maybeResponse = errAny.response?.data ?? errAny.message;
        if (maybeResponse) providerBody = maybeResponse;
      } catch {
        // ignore
      }
      console.error("AI provider error:", providerBody);
      return NextResponse.json(
        { error: "AI provider error", details: providerBody },
        { status: 500 }
      );
    }

    const parts = result.candidates?.[0]?.content?.parts || [];

    let textOutput = "";
    let imageBase64 = "";

    for (const part of parts) {
      if (part.text) textOutput += part.text;
      else if (part.inlineData) imageBase64 = part.inlineData.data ?? "";
    }

    // Do NOT auto-save — return generated image and text only. Client can save explicitly.
    return NextResponse.json({
      text: textOutput,
      image: imageBase64,
      savedImage: null,
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
