import React from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus, Compass, History as HistoryIcon } from "lucide-react";
import getUserRecentImages from "@/actions/getUserRecentImages";
import { Toaster } from "@/components/ui/sonner";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    // send unauthenticated users to sign-in
    return redirect("/(auth)/sign-in");
  }

  type RecentImage = {
    id: number;
    blobUrl: string;
    prompt: string | null;
    createdAt?: Date | null;
  };
  let recentImages: RecentImage[] = [];
  let loadError = "";
  try {
    recentImages = await getUserRecentImages();
  } catch (err) {
    console.error("Failed to load recent images", err);
    loadError = "Failed to load your images. Try again later.";
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Toaster position="top-center" />

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, explore and manage your generated images.
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/create">
            <Button variant="default" size="icon" aria-label="Create">
              <FilePlus className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/explorer">
            <Button variant="outline" size="icon" aria-label="Explore">
              <Compass className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/history">
            <Button variant="ghost" size="icon" aria-label="History">
              <HistoryIcon className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your recent images</CardTitle>
        </CardHeader>
        <CardContent>
          {loadError && <p className="text-sm text-destructive">{loadError}</p>}

          {!loadError && (!recentImages || recentImages.length === 0) && (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                You don&apos;t have any saved images yet.
              </p>
              <Link href="/create">
                <Button>Create your first image</Button>
              </Link>
            </div>
          )}

          {!loadError && recentImages && recentImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {recentImages.map((img) => (
                <div
                  key={img.id}
                  className="rounded-lg overflow-hidden bg-popover/60 p-2 flex flex-col"
                >
                  <div className="relative w-full aspect-square bg-muted rounded-md overflow-hidden">
                    <Image
                      src={img.blobUrl}
                      alt={img.prompt || "image"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="mt-2 flex items-start justify-between gap-2">
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {img.prompt}
                    </p>
                    <div className="flex flex-col gap-1 items-end">
                      <Link href={`/create?view=${img.id}`}>
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
