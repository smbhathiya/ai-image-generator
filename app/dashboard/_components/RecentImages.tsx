"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import useSWR, { mutate } from "swr";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function RecentImages() {
  const { user } = useUser();
  const { data, isLoading, error } = useSWR("/api/recent-images", fetcher);

  useEffect(() => {
    if (user) {
      mutate("/api/recent-images");
    }
  }, [user]);

  if (error) return <p className="text-red-500">Failed to load images.</p>;

  const images = data?.images?.slice(0, 6) || [];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-primary text-2xl font-bold">
          Recent Images
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {(isLoading ? Array.from({ length: 6 }) : images).map(
            (img: any, i: number) => (
              <div
                key={i}
                className="w-full aspect-[2/3] break-inside-avoid overflow-hidden rounded-lg bg-muted"
              >
                {isLoading ? (
                  <div className="w-full h-full animate-pulse bg-muted rounded-lg" />
                ) : (
                  <Image
                    src={img.cloudinaryUrl}
                    alt="Generated"
                    width={300}
                    height={450}
                    className="w-full h-full object-cover rounded-lg"
                    loading="lazy"
                  />
                )}
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
