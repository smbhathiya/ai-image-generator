"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";
import ViewImages from "./_components/ViewImages";
import Link from "next/link";
import { IconCirclePlusFilled } from "@tabler/icons-react";

// Helper function for greeting message
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const { user } = useUser();
  const isLoading = !user;
  const userData = {
    name: user?.fullName || user?.firstName || "User",
  };
  const greeting = getGreeting();

  return (
    <>
      <div className="m-4">
        {/* Greeting and Create Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 mb-4">
          <h1 className="text-primary text-2xl sm:text-3xl lg:text-4xl font-bold">
            {isLoading ? (
              <Skeleton className="h-10 w-60" />
            ) : (
              <>
                {greeting}, {userData.name} 👋
              </>
            )}
          </h1>
          {!isLoading && (
            <Link href="/dashboard/create-new">
              <button className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-md bg-primary text-white px-4 py-2 text-sm font-medium shadow transition-colors hover:bg-primary/90 cursor-pointer">
                <IconCirclePlusFilled className="mr-2" />
                Create new
              </button>
            </Link>
          )}
        </div>

        {/* Your Recent Images (user-specific) */}
        <div className="mb-6">
          {isLoading ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : (
            <ViewImages
              apiUrl="/api/user-recent-images"
              title="Your Recent Images"
              imageLimit={6}
            />
          )}
        </div>

        {/* Recent Images (general) */}
        <div>
          {isLoading ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : (
            <ViewImages
              apiUrl="/api/recent-images"
              title="Recent Images"
              imageLimit={6}
            />
          )}
        </div>
      </div>
    </>
  );
}
