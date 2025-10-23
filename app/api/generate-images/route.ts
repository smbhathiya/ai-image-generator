import { GoogleGenAI, Modality } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

interface PromptRequest {
  prompt: string;
  images?: string[]; // base64 encoded images
  mimeTypes?: string[]; // corresponding MIME types for images
}

function buildEnhancedPrompt(prompt: string, referenceCount: number): string {
  const trimmed = prompt.trim();
  const resolutionInstruction =
    "MAXIMUM RESOLUTION REQUIREMENT: Generate the highest possible resolution image - target 8K (7680×4320) or higher. Use ultra-high definition settings with pixel-perfect clarity and maximum detail density.";
  const qualitySpecs =
    "ULTRA QUALITY SPECIFICATIONS: Professional photography grade, tack-sharp focus throughout, zero compression artifacts, full color gamut, HDR-level dynamic range, studio lighting quality, ultra-fine texture detail, crisp edges, perfect clarity.";
  const technicalRequirements =
    "TECHNICAL MANDATES: Maximum bit depth, highest available resolution multiplier, no downsampling, full detail preservation, professional-grade output quality equivalent to high-end camera systems.";
  const referenceInstruction = referenceCount
    ? `REFERENCE ANALYSIS AND INTEGRATION: Meticulously study the ${referenceCount} provided reference image${
        referenceCount > 1 ? "s" : ""
      }. Extract and enhance the visual style, composition techniques, color grading, lighting approach, artistic elements, and aesthetic qualities. Recreate these elements at maximum resolution while generating original content.`
    : "ORIGINAL HIGH-RESOLUTION CREATION: Generate completely original high-resolution content using maximum creative and technical capabilities.";

  return [
    resolutionInstruction,
    qualitySpecs,
    technicalRequirements,
    referenceInstruction,
    `CREATIVE VISION TO EXECUTE: ${trimmed}`,
    "FINAL OUTPUT MANDATE: Return the absolute highest resolution, highest quality image possible with no quality compromises.",
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
    const modelName = process.env.IMAGE_MODEL || "gemini-2.0-flash-exp";
    console.info(
      `Using AI model: ${modelName} for maximum resolution generation`
    );

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
          generationConfig: {
            temperature: 0.1, // Very low temperature for maximum quality consistency
            topP: 0.9, // Higher top-p for more diverse high-quality options
            topK: 40, // Higher top-k for better quality selection
            maxOutputTokens: 16384, // Increased tokens for more detailed generation
            candidateCount: 1, // Focus on single highest quality output
          },
          // Add safety settings to allow creative content while maintaining quality focus
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
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
      else if (part.inlineData) {
        imageBase64 = part.inlineData.data ?? "";
        console.log(
          `Generated image size: ${imageBase64.length} characters (base64)`
        );

        // Log estimated image dimensions based on base64 size
        const estimatedBytes = (imageBase64.length * 3) / 4;
        const estimatedMB = estimatedBytes / (1024 * 1024);
        console.log(
          `Estimated image size: ${Math.round(
            estimatedBytes / 1024
          )} KB (${estimatedMB.toFixed(2)} MB)`
        );

        // Estimate resolution based on file size (rough calculation for high-quality images)
        const estimatedPixels = Math.sqrt(estimatedBytes / 3); // Rough estimate assuming 3 bytes per pixel
        console.log(
          `Estimated resolution: ~${Math.round(estimatedPixels)}x${Math.round(
            estimatedPixels
          )} pixels`
        );
      }
    }

    if (!imageBase64) {
      console.error("No image data received from AI model");
      return NextResponse.json(
        {
          error:
            "No image was generated. Please try again with a different prompt.",
        },
        { status: 500 }
      );
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
