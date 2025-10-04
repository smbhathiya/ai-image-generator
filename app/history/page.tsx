"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Copy, HistoryIcon } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ImageData {
  id: string;
  blobUrl: string;
  prompt: string;
  createdAt: string;
  [key: string]: unknown;
}

export default function History() {
  const { user } = useUser();
  const isLoading = !user;

  const [images, setImages] = useState<ImageData[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const fetchingRef = useRef(false); // Ref to track active fetches

  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  const copyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast.success("Prompt copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy prompt:", err);
      toast.error("Failed to copy prompt");
    }
  };

  const handleImageLoad = (id: string) => {
    setLoadingStates((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  const handleImageError = (id: string) => {
    setLoadingStates((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  const fetchImages = useCallback(async () => {
    // Prevent multiple concurrent fetch requests
    if (loadingImages || !hasMore || fetchingRef.current) return;

    // Set fetching flag to true
    fetchingRef.current = true;
    setLoadingImages(true);

    try {
      const res = await fetch(`/api/user-images?offset=${offset}&limit=10`);

      if (!res.ok) {
        throw new Error(`Failed to fetch images: ${res.status}`);
      }

      const data = await res.json();

      if (data.length > 0) {
        const newLoadingStates: Record<string, boolean> = {};
        data.forEach((img: ImageData) => {
          newLoadingStates[img.id] = true;
        });

        setLoadingStates((prev) => ({
          ...prev,
          ...newLoadingStates,
        }));

        setImages((prevImages) => {
          const newImages = data.filter(
            (newImage: ImageData) =>
              !prevImages.some((image) => image.id === newImage.id)
          );
          return [...prevImages, ...newImages];
        });
        setOffset((prevOffset) => prevOffset + data.length);
        setHasMore(data.length === 10); // Changed from 20 to 10 to match the limit in fetch
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load images:", error);
    } finally {
      setLoadingImages(false);
      // Reset fetching flag when done
      fetchingRef.current = false;
    }
  }, [offset, loadingImages, hasMore]);

  // Improved scroll handler with proper throttling
  const handleScroll = useCallback(() => {
    if (
      !containerRef.current ||
      !hasMore ||
      loadingImages ||
      fetchingRef.current
    )
      return;

    const scrollContainer = containerRef.current.closest(
      ".overflow-y-auto"
    ) as HTMLElement;
    if (!scrollContainer) return;

    const { scrollTop, clientHeight, scrollHeight } = scrollContainer;
    const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - 400; // Increased threshold

    if (scrolledToBottom) {
      fetchImages();
    }
  }, [loadingImages, hasMore, fetchImages]);

  useEffect(() => {
    const scrollContainer = containerRef.current?.closest(
      ".overflow-y-auto"
    ) as HTMLElement;

    if (scrollContainer) {
      // Add debounce for scroll event
      let scrollTimeout: NodeJS.Timeout;
      const debouncedScroll = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 100);
      };

      scrollContainer.addEventListener("scroll", debouncedScroll);
      return () => {
        clearTimeout(scrollTimeout);
        scrollContainer.removeEventListener("scroll", debouncedScroll);
      };
    }
  }, [handleScroll]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <div className=" pb-32" ref={containerRef}>
      <div className="max-w-4xl mx-auto">
        <Toaster position="top-center" />

        <Card className="bg-background border-0 shadow-none">
          <CardHeader className="flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 gap-2" />
            <CardTitle className="text-2xl font-bold">History</CardTitle>
          </CardHeader>
          <CardContent>

        <div className="space-y-4">
          {(loadingImages || isLoading) && images.length === 0
            ? Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-popover/90 backdrop-blur-md border border-border shadow-lg p-4"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="w-8 h-8 rounded-full" />
                  </div>
                  <Skeleton className="w-full h-3 mb-3" />
                  <Skeleton className="w-full h-48 rounded-lg" />
                </div>
              ))
            : images.map((image) => (
                <div
                  key={image.id}
                  className="rounded-xl bg-popover/90 backdrop-blur-md border border-border shadow-lg overflow-hidden"
                >
                  {/* Header with timestamp and copy button */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(image.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => copyPrompt(image.prompt)}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                        aria-label="Copy prompt"
                      >
                        <Copy className="w-4 h-4 text-muted-foreground hover:text-primary" />
                      </button>
                    </div>

                    {/* Prompt text */}
                    <div className="mb-4 p-3 bg-muted/30 rounded-lg border-primary/40 border-1">
                      <p className="text-sm font-medium text-primary mb-1">
                        Prompt:
                      </p>
                      <p className="text-sm text-foreground leading-relaxed">
                        {image.prompt}
                      </p>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative px-4 pb-4">
                    {loadingStates[image.id] && (
                      <div className="absolute inset-0 z-10 mx-4 mb-4">
                        <Skeleton className="w-full h-full rounded-lg" />
                      </div>
                    )}
                    <Image
                      src={image.blobUrl as string}
                      alt={`Generated image for: ${image.prompt}`}
                      width={600}
                      height={600}
                      className={`w-full h-auto object-cover rounded-lg shadow-md transition-opacity duration-300 ${
                        loadingStates[image.id] ? "opacity-0" : "opacity-100"
                      }`}
                      onLoad={() => handleImageLoad(image.id)}
                      onError={() => handleImageError(image.id)}
                    />
                  </div>
                </div>
              ))}
        </div>

        {/* Loading indicator at bottom */}
        {loadingImages && images.length > 0 && hasMore && (
          <div className="w-full flex justify-center my-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-muted-foreground">
                Loading more images...
              </span>
            </div>
          </div>
        )}

        {!loadingImages && images.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No images found. Create your first image
            </p>
          </div>
        )}

        {!loadingImages && !hasMore && images.length > 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            You&apos;ve reached the end of your image history
          </div>
        )}
        </CardContent>
        </Card>
      </div>
    </div>
  );
}
