"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Send, FilePlus, X } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

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
  const [generatingPrompt, setGeneratingPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<ImageResponse | null>(
    null
  );
  const [responseText, setResponseText] = useState("");
  const [error, setError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [base64Images, setBase64Images] = useState<string[]>([]);
  const [viewingFullSize, setViewingFullSize] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  const fetchImage = async (payload: { prompt: string; images?: string[] }) => {
    const res = await fetch("/api/generate-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  };

  const generateImage = useCallback(async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }

    const currentPrompt = prompt.trim();
    const currentBase64Images = [...base64Images]; // Capture current reference images
    setGeneratingPrompt(currentPrompt);
    setPrompt(""); // Clear input after starting generation
    // Clear reference images after starting generation
    setSelectedFiles([]);
    setPreviews([]);
    setBase64Images([]);
    // reset textarea height when prompt cleared
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);
    setGeneratedImage(null);
    setResponseText("");
    setError("");

    try {
      // Use captured base64 images before they were cleared
      console.log(
        `Generating with ${currentBase64Images.length} reference images`
      );

      // Send structured payload: prompt + base64 images array
      const result = await fetchImage({
        prompt: currentPrompt,
        images: currentBase64Images,
      });

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
  }, [prompt, base64Images]);

  // File input handlers
  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedFiles(files);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);

    // Convert files to base64 immediately
    console.log(`Converting ${files.length} images to base64`);
    toast.loading("Processing images...");
    try {
      const base64Array: string[] = [];

      for (const file of files) {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result as string;
            // Remove data:image/...;base64, prefix
            const base64Data = result.split(",")[1];
            resolve(base64Data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        base64Array.push(base64);
      }

      setBase64Images(base64Array);
      console.log(`Converted ${base64Array.length} images to base64`);
      toast.dismiss();
      toast.success(`Ready to use ${base64Array.length} reference image(s)`);
    } catch (err) {
      console.error("Image conversion failed", err);
      toast.dismiss();
      toast.error("Failed to process images.");
      // Clear selection on error
      setSelectedFiles([]);
      setPreviews([]);
      setBase64Images([]);
    }
  };

  const removePreview = (index: number) => {
    const copyFiles = [...selectedFiles];
    const copyPreviews = [...previews];
    const copyBase64 = [...base64Images];
    // revoke the object URL
    URL.revokeObjectURL(copyPreviews[index]);
    copyFiles.splice(index, 1);
    copyPreviews.splice(index, 1);
    copyBase64.splice(index, 1);
    setSelectedFiles(copyFiles);
    setPreviews(copyPreviews);
    setBase64Images(copyBase64);
  };

  // Keyboard handler: Enter to generate, Shift+Enter newline
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        // trigger generation
        void generateImage();
      }
    };
    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, [generateImage]);

  // When an image is generated, scroll it into view so the user sees it immediately
  useEffect(() => {
    if (generatedImage && imageContainerRef.current) {
      try {
        imageContainerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } catch {
        // ignore
      }
    }
  }, [generatedImage]);

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

  const saveImage = async () => {
    if (!generatedImage?.image) return;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    try {
      toast.dismiss();
      toast.loading("Saving image...");

      // If the request hangs, remove the loading toast after 15s
      timeoutId = setTimeout(() => {
        toast.dismiss();
        toast.error("Saving image timed out. Please try again.");
      }, 15000);

      // if the prompt input was cleared after generation, use the generatingPrompt
      const promptToSave = generatingPrompt || prompt;

      const res = await fetch("/api/images/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Image: generatedImage.image,
          prompt: promptToSave,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.dismiss();
        toast.error(data?.error || "Failed to save image");
        return;
      }

      // Update state with saved image info
      setGeneratedImage((prev) =>
        prev
          ? {
              ...prev,
              savedImage: data.image,
            }
          : prev
      );

      // clear loading toast then show success
      toast.dismiss();
      toast.success("Image saved successfully");
    } catch (err) {
      console.error("Save error", err);
      toast.dismiss();
      toast.error("Failed to save image");
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  };

  return (
    <div className="m-4 pb-32">
      <div className="max-w-4xl mx-auto">
        <Toaster position="top-center" />

        <Card className="bg-background border-0 shadow-none">
          <CardHeader className="flex items-center gap-2">
            <div className="flex items-center gap-2 mr-auto">
              <FilePlus className="w-6 h-6" />
              <CardTitle className="text-2xl font-bold">Create New</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="pb-16">
            {error && <p className="text-red-500 mt-4">{error}</p>}

            {/* Generated prompt (stacked) */}
            {(loading || (generatingPrompt && generatedImage)) && (
              <div className="w-full my-4 p-3 bg-muted/30 rounded-lg border-l-4 border-primary break-words">
                <p className="text-sm font-medium text-primary">
                  {loading ? "Generating..." : "Generated:"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {generatingPrompt}
                </p>
              </div>
            )}

            {/* Action buttons - shown when image is generated (stacked below prompt) */}
            {generatedImage && (
              <div className="w-full sm:w-auto my-2 flex gap-2 justify-start">
                <Button onClick={downloadImage} variant="secondary" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                {generatedImage.savedImage ? (
                  <Button size="sm" disabled>
                    Saved
                  </Button>
                ) : (
                  <Button size="sm" onClick={saveImage}>
                    Save
                  </Button>
                )}
              </div>
            )}

            <div className="mt-6 flex flex-col items-center">
              {loading && (
                <Skeleton className="w-full max-w-xs h-24 rounded-lg aspect-auto" />
              )}

              {!loading && generatedImage && (
                <div
                  ref={imageContainerRef}
                  className="relative w-full max-w-xs cursor-pointer"
                >
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
                </div>
              )}
            </div>

            {responseText && (
              <p className="mt-4 text-sm text-muted-foreground">
                {responseText}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

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

      {/* Fixed bottom prompt bar - aligned with bottom nav */}
      <div className="fixed left-0 right-0 bottom-4 z-[60] flex justify-center pointer-events-none">
        <div className="w-[calc(100%-2rem)] max-w-4xl mx-auto pointer-events-auto ">
          <div className="rounded-2xl bg-background/90 backdrop-blur-md border border-border/60 shadow-xl p-3 sm:p-4 flex gap-3 items-end mb-24">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesChange}
              className="hidden"
              id="file-input-bottom"
            />

            <button
              type="button"
              onClick={() =>
                document.getElementById("file-input-bottom")?.click()
              }
              className="rounded-lg bg-muted/40 p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center justify-center"
              aria-label="Add reference images"
            >
              <FilePlus className="w-5 h-5" />
            </button>

            <div className="flex-1">
              <div className="relative w-full">
                {previews.length > 0 && (
                  <div className="absolute inset-x-3 top-2 z-10 flex gap-2 overflow-x-auto pb-2">
                    {previews.map((p, i) => (
                      <div
                        key={`${p}-${i}`}
                        className="group relative flex-shrink-0 h-12 w-12 overflow-hidden rounded-md border border-border/80 bg-muted"
                      >
                        <Image
                          src={p}
                          alt={`Reference ${i + 1}`}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePreview(i)}
                          aria-label="Remove reference"
                          className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-opacity group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <textarea
                  ref={textareaRef}
                  placeholder="Describe what you want in vivid detail (composition, mood, materials, lighting)..."
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                    const el = e.target;
                    el.style.height = "auto";
                    el.style.height = `${el.scrollHeight}px`;
                  }}
                  className={cn(
                    "relative z-0 w-full min-h-[52px] max-h-48 resize-none rounded-xl border border-border/60 bg-background/70 px-3 py-3 text-base leading-relaxed outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/30",
                    previews.length > 0 && "pt-20"
                  )}
                  style={{ height: "auto" }}
                />
              </div>
              {previews.length > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {previews.length} reference image
                  {previews.length > 1 ? "s" : ""} linked to this prompt.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={generateImage}
              disabled={loading}
              className="rounded-full bg-primary p-3 text-white hover:opacity-95 disabled:opacity-60 flex items-center justify-center"
              aria-label="Generate image"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNew;
