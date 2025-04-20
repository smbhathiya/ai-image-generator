"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface ImageData {
  id: string;
  cloudinaryUrl: string;
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
  const [randomHeights, setRandomHeights] = useState<number[]>([]);

  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [columnCount, setColumnCount] = useState(4);

  useEffect(() => {
    const heights = Array.from({ length: 10 }).map(
      () => 200 + Math.floor(Math.random() * 200)
    );
    setRandomHeights(heights);
  }, []);

  useEffect(() => {
    const updateColumnCount = () => {
      if (window.innerWidth < 640) {
        setColumnCount(1);
      } else if (window.innerWidth < 1024) {
        setColumnCount(2);
      } else if (window.innerWidth < 1280) {
        setColumnCount(3);
      } else if (window.innerWidth < 1536) {
        setColumnCount(4);
      } else if (window.innerWidth < 1920) {
        setColumnCount(5);
      } else {
        setColumnCount(5);
      }
    };

    updateColumnCount();
    window.addEventListener("resize", updateColumnCount);
    return () => window.removeEventListener("resize", updateColumnCount);
  }, []);

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
    if (loadingImages || !hasMore) return;
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
        setHasMore(data.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load images:", error);
    } finally {
      setLoadingImages(false);
    }
  }, [offset, loadingImages, hasMore]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || !hasMore || loadingImages) return;

    const scrollContainer = containerRef.current.closest(
      ".overflow-y-auto"
    ) as HTMLElement;
    if (!scrollContainer) return;

    const { scrollTop, clientHeight, scrollHeight } = scrollContainer;
    const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - 300;

    if (scrolledToBottom) {
      fetchImages();
    }
  }, [loadingImages, hasMore, fetchImages]);

  useEffect(() => {
    const scrollContainer = containerRef.current?.closest(
      ".overflow-y-auto"
    ) as HTMLElement;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="m-4" ref={containerRef}>
      <div className="mb-6">
        <div
          className={`columns-1 ${columnCount >= 2 ? "sm:columns-2" : ""} ${
            columnCount >= 3 ? "lg:columns-3" : ""
          } ${columnCount >= 4 ? "xl:columns-4" : ""} ${
            columnCount >= 5 ? "2xl:columns-5" : ""
          } gap-4 space-y-4`}
        >
          {(loadingImages || isLoading) && images.length === 0
            ? randomHeights.map((height, idx) => (
                <div
                  key={idx}
                  className="break-inside-avoid overflow-hidden rounded-lg shadow-md bg-muted"
                  style={{ height: `${height}px` }}
                >
                  <Skeleton className="w-full h-full rounded-lg" />
                </div>
              ))
            : images.map((image) => (
                <div
                  key={image.id}
                  className="break-inside-avoid overflow-hidden rounded-lg shadow-md relative"
                >
                  {/* Skeleton overlay while loading */}
                  {loadingStates[image.id] && (
                    <div className="absolute inset-0 z-0">
                      <Skeleton className="w-full h-full rounded-lg" />
                    </div>
                  )}

                  <Image
                    src={image.cloudinaryUrl}
                    alt="Image"
                    width={500}
                    height={300}
                    className={`w-full h-auto object-cover transition-transform duration-300 hover:scale-105 relative z-10 ${
                      loadingStates[image.id] ? "opacity-0" : "opacity-100"
                    }`}
                    onLoad={() => handleImageLoad(image.id)}
                    onError={() => handleImageError(image.id)}
                  />
                </div>
              ))}
        </div>

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
      </div>
    </div>
  );
}
