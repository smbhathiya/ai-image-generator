"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import { useState, useEffect, useCallback, useRef, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import getImagesPaginated, { Images } from "@/actions/getImagesPaginated";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export default function Explorer() {
  const { user } = useUser();
  const isLoading = !user;
  const userData = {
    name: user?.fullName || user?.firstName || "User",
  };
  const greeting = getGreeting();

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
      <div className="bg-muted/40 backdrop-blur-md rounded-xl p-4 sm:px-6 sm:py-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-sm border border-muted">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-primary mb-1 flex flex-wrap items-center gap-2">
            {isLoading ? (
              <Skeleton className="h-8 sm:h-10 w-40 sm:w-60" />
            ) : (
              <>
                {greeting},{" "}
                <span className="text-muted-foreground break-words">
                  {userData.name}
                </span>
              </>
            )}
          </h1>
          {!isLoading && (
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
              Welcome back! Hope you&apos;re having a productive day
            </p>
          )}
        </div>

        {!isLoading && (
          <Link
            href="/explorer/create-new"
            className="mt-4 sm:mt-0 block sm:inline-block"
          >
            <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-primary text-white px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold shadow hover:bg-primary/90 transition-all duration-200">
              <IconCirclePlusFilled className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Create new
            </button>
          </Link>
        )}
      </div>

      <div className="mb-6">
        {isLoading || (isPending && !hasFetched) ? (
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
          <div className="flex gap-3">
            {Array.from({ length: columnCount }).map((_, colIndex) => (
              <div key={`column-${colIndex}`} className="flex-1 space-y-3">
                {images
                  .filter((_, imgIndex) => imgIndex % columnCount === colIndex)
                  .map((image) => (
                    <div
                      key={image.id}
                      className="overflow-hidden rounded-lg shadow-md relative"
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
                        src={image.cloudinaryUrl}
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

        {!isPending && images.length === 0 && !isLoading && hasFetched && (
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
