"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect, useCallback, useRef, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import getImagesPaginated, { Images } from "@/actions/getImagesPaginated";

export default function Explorer() {
  // Note: removed greeting and create-button UI per design request.
  // Page now immediately shows the Pinterest-like image grid.

  const [images, setImages] = useState<Images[]>([]);
  const [isPending, startTransition] = useTransition();
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasFetched, setHasFetched] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fetchingRef = useRef(false); // Ref to track active fetches
  const limit = 20;

  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [columnCount, setColumnCount] = useState(4);

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
      } else {
        setColumnCount(5);
      }
    };

    updateColumnCount();
    window.addEventListener("resize", updateColumnCount);
    return () => window.removeEventListener("resize", updateColumnCount);
  }, []);

  const fetchImages = useCallback(() => {
    // Prevent multiple concurrent fetch requests
    if (isPending || fetchingRef.current || !hasMore) return;

    // Set fetching flag to true
    fetchingRef.current = true;

    startTransition(async () => {
      try {
        const { images: newImages, totalCount } = await getImagesPaginated(
          offset,
          limit
        );

        if (newImages.length > 0) {
          const newLoadingStates: Record<string, boolean> = {};
          newImages.forEach((img) => {
            newLoadingStates[img.id.toString()] = true;
          });

          setLoadingStates((prev) => ({
            ...prev,
            ...newLoadingStates,
          }));

          setImages((prevImages) => {
            const uniqueImages = newImages.filter(
              (newImage) =>
                !prevImages.some((image) => image.id === newImage.id)
            );
            return [...prevImages, ...uniqueImages];
          });

          setOffset((prevOffset) => prevOffset + limit);
          setHasMore(offset + limit < totalCount);
        } else {
          setHasMore(false);
        }

        setHasFetched(true);
      } catch (error) {
        console.error("Failed to load images:", error);
        toast.error("Failed to load images. Please try again.");
        setHasFetched(true);
      } finally {
        // Reset fetching flag when done
        fetchingRef.current = false;
      }
    });
  }, [offset, isPending, limit, hasMore]);

  // Improved scroll handler with throttling
  const handleScroll = useCallback(() => {
    if (!containerRef.current || fetchingRef.current) return;

    const scrollContainer = containerRef.current.closest(
      ".overflow-y-auto"
    ) as HTMLElement;
    if (!scrollContainer) return;

    // Improved bottom detection with a bigger buffer
    const scrollPosition =
      scrollContainer.scrollTop + scrollContainer.clientHeight;
    const scrollThreshold = scrollContainer.scrollHeight - 300; // Increased threshold

    if (
      scrollPosition >= scrollThreshold &&
      hasMore &&
      !isPending &&
      !fetchingRef.current
    ) {
      fetchImages();
    }
  }, [isPending, hasMore, fetchImages]);

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

  const handleImageLoad = (id: number) => {
    setLoadingStates((prev) => ({
      ...prev,
      [id.toString()]: false,
    }));
  };

  return (
    <div className="m-4" ref={containerRef}>
      {/* Removed greeting + create button — show images grid directly */}

      <div className="mb-6">
        {!hasFetched ? (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4`}
            style={{
              gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: columnCount * 2 }).map((_, idx) => (
              <Skeleton key={idx} className="w-full h-64 rounded-lg" />
            ))}
          </div>
        ) : (
          <div
            className="masonry-grid"
            style={{
              columnCount: columnCount,
              columnGap: "1rem",
            }}
          >
            {images.map((image) => (
              <div
                key={image.id}
                className="masonry-item mb-3 break-inside-avoid rounded-lg overflow-hidden shadow-md relative"
                style={{
                  minHeight: loadingStates[image.id.toString()]
                    ? "200px"
                    : "auto",
                }}
              >
                {loadingStates[image.id.toString()] && (
                  <Skeleton className="absolute inset-0 w-full h-full rounded-lg" />
                )}
                <Image
                  src={image.blobUrl}
                  alt="Image"
                  width={500}
                  height={300}
                  className={`w-full h-auto object-cover transition-transform duration-300 hover:scale-105 ${
                    loadingStates[image.id.toString()]
                      ? "opacity-0"
                      : "opacity-100"
                  }`}
                  onLoad={() => handleImageLoad(image.id)}
                  onError={() => handleImageLoad(image.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Loading indicator at bottom */}
        {isPending && hasMore && hasFetched && (
          <div className="w-full flex justify-center mt-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-muted-foreground">
                Loading more images...
              </span>
            </div>
          </div>
        )}

        {!isPending && images.length === 0 && hasFetched && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No images found. Create your first image!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
