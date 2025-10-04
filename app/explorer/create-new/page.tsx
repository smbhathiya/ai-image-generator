"use client";
import React, { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, X } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

interface ImageResponse {
  image: string;
  text: string;
  savedImage?: {
    id: number;
    blobUrl: string;
  };
}

const CreateNew = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<ImageResponse | null>(
    null
  );
  const [responseText, setResponseText] = useState("");
  const [error, setError] = useState("");
  const [viewingFullSize, setViewingFullSize] = useState(false);

  const fetchImage = async (prompt: string) => {
    const res = await fetch("/api/generate-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    return res.json();
  };

  const generateImage = useCallback(async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }

    setLoading(true);
    setGeneratedImage(null);
    setResponseText("");
    setError("");

    try {
      const result = await fetchImage(prompt);

      if (result?.image) {
        setGeneratedImage(result);
        setResponseText(result.text || "");
        toast.success("Image generated successfully!");
      } else {
        setError(result?.error || "Something went wrong");
        toast.error("Failed to generate image. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the API");
      toast.error("Failed to connect to the API. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [prompt]);

  const downloadImage = () => {
    if (!generatedImage?.image) return;

    // Generate a unique ID for the download
    const uniqueId =
      Date.now().toString(36) + Math.random().toString(36).substring(2, 10);

    const a = document.createElement("a");
    a.href = `data:image/png;base64,${generatedImage.image}`;
    a.download = `ai-generated-image-${uniqueId}.png`;
    a.click();

    toast.success("Image downloaded successfully!");
  };

  return (
    <div className="m-4">
      <Toaster />

      <Card className="border-0">
        <CardHeader>
          <CardTitle className="text-primary text-2xl font-bold">
            Create New Image
          </CardTitle>
          <CardDescription>
            Describe a scene or idea and we&apos;ll bring it to life with AI
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Textarea
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-24"
          />

          <Button className="mt-4" onClick={generateImage} disabled={loading}>
            {loading ? "Generating..." : "Generate Image"}
          </Button>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          <div className="mt-6 flex flex-col items-center">
            {loading && (
              <Skeleton className="w-full max-w-md h-64 rounded-lg aspect-auto" />
            )}

            {!loading && generatedImage && (
              <div className="relative w-full max-w-md cursor-pointer">
                <div
                  className="relative overflow-hidden rounded-lg"
                  onClick={() => setViewingFullSize(true)}
                >
                  <Image
                    src={
                      generatedImage.savedImage?.blobUrl ||
                      `data:image/png;base64,${generatedImage.image}`
                    }
                    alt="Generated Image"
                    width={512}
                    height={512}
                    className="w-full h-auto object-contain rounded-lg shadow-md"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 text-center">
                    Click to view Image
                  </div>
                </div>
                <Button
                  onClick={downloadImage}
                  className="mt-4 w-full"
                  variant="secondary"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
              </div>
            )}
          </div>

          {responseText && (
            <p className="mt-4 text-sm text-muted-foreground">{responseText}</p>
          )}
        </CardContent>
      </Card>

      {viewingFullSize && generatedImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setViewingFullSize(false)}
        >
          <div
            className="relative max-w-[95vw] max-h-[95vh] bg-background rounded-xl overflow-hidden shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setViewingFullSize(false)}
              className="absolute top-4 right-4 p-2 bg-background/80 hover:bg-primary text-foreground hover:text-white cursor-pointer rounded-full z-10 shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center justify-center p-4">
              <div className="w-auto h-auto max-w-full max-h-[80vh] overflow-hidden">
                <Image
                  src={
                    generatedImage.savedImage?.blobUrl ||
                    `data:image/png;base64,${generatedImage.image}`
                  }
                  alt="Generated Image"
                  width={1024}
                  height={1024}
                  className="object-contain w-auto h-auto"
                />
              </div>

              <Button
                className="mt-6 w-full max-w-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  downloadImage();
                  setViewingFullSize(false);
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Image
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNew;
