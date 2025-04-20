"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

interface ImageData {
  id: string;
  cloudinaryUrl: string;
  [key: string]: unknown;
}

export default function Explorer() {
  const { user } = useUser();
  const isLoading = !user;
  const userData = {
    name: user?.fullName || user?.firstName || "User",
  };
  const greeting = getGreeting();

  const [images, setImages] = useState<ImageData[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const fetchImages = useCallback(async () => {
    if (loadingImages) return;
    setLoadingImages(true);

    try {
      const res = await fetch(
        `/api/images-paginated?offset=${offset}&limit=10`
      );
      const data = await res.json();

      if (data.length > 0) {
        setImages((prevImages) => {
          const newImages = data.filter(
            (newImage: ImageData) =>
              !prevImages.some((image) => image.id === newImage.id)
          );
          return [...prevImages, ...newImages];
        });
        setOffset((prevOffset) => prevOffset + 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load images:", error);
    } finally {
      setLoadingImages(false);
    }
  }, [offset, loadingImages]);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const bottom = document.documentElement.scrollHeight;

    if (scrollPosition >= bottom - 100 && !loadingImages && hasMore) {
      fetchImages();
    }
  }, [loadingImages, hasMore, fetchImages]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="m-4">
      <div className="bg-muted/40 backdrop-blur-md rounded-xl px-6 py-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-sm border border-muted">
        <div>
          <h1 className="text-2xl sm:text-2xl font-extrabold text-primary mb-1 flex items-center gap-2">
            {isLoading ? (
              <Skeleton className="h-10 w-60" />
            ) : (
              <>
                {greeting},{" "}
                <span className="text-muted-foreground">{userData.name}</span>
              </>
            )}
          </h1>
          {!isLoading && (
            <p className="text-muted-foreground text-sm sm:text-base">
              Welcome back! Hope you&apos;re having a productive day
            </p>
          )}
        </div>

        {!isLoading && (
          <Link href="/explorer/create-new">
            <button className="mt-4 cursor-poi sm:mt-0 inline-flex items-center justify-center rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-semibold shadow hover:bg-primary/90 transition-all duration-200">
              <IconCirclePlusFilled className="mr-2" />
              Create new
            </button>
          </Link>
        )}
      </div>

      <div className="mb-6">
        {isLoading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {Array.from({ length: 10 }).map((_, idx) => (
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
