"use client";
import React, { useState } from "react";
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

function CreateNew() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [responseText, setResponseText] = useState("");
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setImages([]);
    setResponseText("");
    setError("");

    try {
      const results = await Promise.all([
        fetch("/api/generate-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }),
        fetch("/api/generate-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }),
      ]);

      const jsons = await Promise.all(results.map((res) => res.json()));
      const successResponses = jsons.filter((res, i) => results[i].ok);

      if (successResponses.length > 0) {
        setImages(successResponses.map((res) => res.image));
        setResponseText(successResponses[0].text || "");
      } else {
        setError(jsons[0].error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the API");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (image: string, index: number) => {
    const a = document.createElement("a");
    a.href = `data:image/png;base64,${image}`;
    a.download = `ai-generated-image-${index + 1}.png`;
    a.click();
  };

  const openImagePopup = (image: string) => {
    setSelectedImage(image);
  };

  const closeImagePopup = () => {
    setSelectedImage(null);
  };

  return (
    <div className="m-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary text-2xl font-bold">
            Create New Image
          </CardTitle>
          <CardDescription>
            Describe a scene or idea and we'll bring it to life with AI.
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

          <div className="mt-6 flex flex-row gap-4">
            {loading &&
              [0, 1].map((i) => (
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
                  onClick={() => openImagePopup(img)}
                >
                  <Image
                    src={`data:image/png;base64,${img}`}
                    alt={`Generated Image ${i + 1}`}
                    width={256}
                    height={256}
                    className="rounded-2xl border object-cover aspect-square"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadImage(img, i);
                    }}
                    className="absolute top-2 right-2 bg-primary p-2 rounded-full shadow hover:bg-primary/80 transition"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
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
          onClick={closeImagePopup}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] w-auto bg-accent rounded-2xl overflow-hidden shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeImagePopup}
              className="absolute top-2 right-2 p-2 hover:text-primary-foreground text-primary-foreground cursor-pointer rounded-full z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center justify-center p-6">
              <div className="w-full flex justify-center">
                <Image
                  src={`data:image/png;base64,${selectedImage}`}
                  alt="Selected Image"
                  width={512}
                  height={512}
                  className="rounded-xl  max-w-[70vh] h-auto bg-primary"
                />
              </div>

              <Button
                className="mt-6 w-full max-w-xs text-white font-bold"
                onClick={() =>
                  downloadImage(selectedImage, images.indexOf(selectedImage))
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
}

export default CreateNew;
