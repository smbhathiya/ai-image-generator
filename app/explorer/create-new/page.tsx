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

interface ImageResponse {
  image: string;
  text: string;
  savedImage?: {
    id: number;
    cloudinaryUrl: string;
    cloudinaryId: string;
  };
}

const CreateNew = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImageResponse[]>([]);
  const [responseText, setResponseText] = useState("");
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<ImageResponse | null>(
    null
  );

  const fetchImage = async (prompt: string) => {
    const res = await fetch("/api/generate-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    return res.json();
  };

  const generateImage = useCallback(async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setImages([]);
    setResponseText("");
    setError("");

    try {
      const results = await Promise.all([
        fetchImage(prompt),
        fetchImage(prompt),
      ]);
      const validResponses = results.filter((res) => res?.image);

      if (validResponses.length > 0) {
        setImages(validResponses as ImageResponse[]);
        setResponseText(validResponses[0].text || "");
      } else {
        setError(results[0]?.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the API");
    } finally {
      setLoading(false);
    }
  }, [prompt]);

  const downloadImage = (image: string, index: number) => {
    const a = document.createElement("a");
    a.href = `data:image/png;base64,${image}`;
    a.download = `ai-generated-image-${index + 1}.png`;
    a.click();
  };

  return (
    <div className="m-4">
      <Card>
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
          />

          <Button className="mt-4" onClick={generateImage} disabled={loading}>
            {loading ? "Generating..." : "Generate Images"}
          </Button>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          <div className="mt-6 flex flex-row gap-4 flex-wrap">
            {loading &&
              Array.from({ length: 2 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-64 h-64 rounded-2xl aspect-square"
                />
              ))}

            {!loading &&
              images.map((img, i) => (
                <div
                  key={i}
                  className="relative w-64 h-64 cursor-pointer"
                  onClick={() => setSelectedImage(img)}
                >
                  <Image
                    src={
                      img.savedImage?.cloudinaryUrl ||
                      `data:image/png;base64,${img.image}`
                    }
                    alt={`Generated Image ${i + 1}`}
                    width={256}
                    height={256}
                    className="rounded-2xl border object-cover aspect-square"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadImage(img.image, i);
                    }}
                    className="absolute top-2 right-2 bg-primary p-2 rounded-full shadow hover:bg-primary/80 transition"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                  {img.savedImage && (
                    <span className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Saved
                    </span>
                  )}
                </div>
              ))}
          </div>

          {responseText && (
            <p className="mt-4 text-sm text-muted-foreground">{responseText}</p>
          )}
        </CardContent>
      </Card>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] w-auto bg-accent rounded-2xl overflow-hidden shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 p-2 hover:text-primary-foreground text-primary-foreground cursor-pointer rounded-full z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center justify-center p-6">
              <div className="relative w-[70vh] h-[70vh] max-w-full max-h-full overflow-hidden rounded-xl bg-primary">
                <img
                  src={
                    selectedImage.savedImage?.cloudinaryUrl ||
                    `data:image/png;base64,${selectedImage.image}`
                  }
                  alt="Selected Image"
                  className="object-cover w-full h-full rounded-xl"
                />
              </div>

              <Button
                className="mt-6 w-full max-w-xs text-white font-bold"
                onClick={() =>
                  downloadImage(
                    selectedImage.image,
                    images.indexOf(selectedImage)
                  )
                }
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
