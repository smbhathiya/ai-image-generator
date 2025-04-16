"use client";

import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  const { user } = useUser();

  return (
    <header className="w-full flex items-center justify-between p-6 border-b">
      <h1 className="text-xl font-bold text-primary">MyApp</h1>

      <div className="space-x-4">
        {user ? (
          <>
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <UserButton />
          </>
        ) : (
          <Button asChild>
            <Link href="/dashboard">Sign In</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
