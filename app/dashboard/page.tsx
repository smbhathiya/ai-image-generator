"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";

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
        <h1 className="text-primary text-2xl sm:text-3xl lg:text-4xl font-bold p-4 mb-4">
          {isLoading ? (
            <Skeleton className="h-10 w-60" />
          ) : (
            <>
              {greeting}, {userData.name} 👋
            </>
          )}
        </h1>
        <Card>
          <CardHeader>
            <CardTitle className="text-primary text-2xl font-bold">
              Recent
            </CardTitle>
            <CardDescription>Comming soon</CardDescription>
          </CardHeader>
        </Card>
      </div>
      <div className="m-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary text-2xl font-bold">
              History
            </CardTitle>
            <CardDescription>Comming soon</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
