"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect, useCallback } from "react";
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
  const [loadingImages, setLoadingImages] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch(`/api/user-images?offset=${offset}&limit=5`);
      const data = await res.json();

      if (data.length > 0) {
        setImages((prevImages) => {
          const newImages = data.filter(
            (newImage: ImageData) =>
              !prevImages.some((image) => image.id === newImage.id)
          );
          return [...prevImages, ...newImages];
        });
        setOffset((prevOffset) => prevOffset + 5); 
      } else {
        setHasMore(false); 
      }
    } catch (error) {
      console.error("Failed to load images:", error);
    } finally {
      setLoadingImages(false);
    }
  }, [offset]);

  useEffect(() => {
    if (!isLoading) {
      fetchImages();
    }
  }, [isLoading, fetchImages]);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const bottom = document.documentElement.scrollHeight;

    if (scrollPosition >= bottom - 100 && !loadingImages && hasMore) {
      setLoadingImages(true);
      fetchImages();
    }
  }, [loadingImages, hasMore, fetchImages]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="m-4">
      <div className="mb-6">
        {isLoading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton key={idx} className="w-full h-[300px] rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {images.map((image: ImageData, index: number) => (
              <div
                key={`${image.id}-${index}`}
                className="break-inside-avoid overflow-hidden rounded-lg shadow-md"
              >
                <Image
                  src={image.cloudinaryUrl}
                  alt="Image"
                  width={500}
                  height={300}
                  className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}

            {loadingImages &&
              Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton
                  key={`loading-${idx}`}
                  className="w-full h-[300px] rounded-lg"
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
