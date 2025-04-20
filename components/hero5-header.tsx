"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { IconSparkles } from "@tabler/icons-react";

export const HeroHeader = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav className="fixed z-20 w-full px-2">
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            isScrolled &&
              "bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5"
          )}
        >
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link
              href="/"
              aria-label="home"
              className="flex items-center space-x-2"
            >
              <IconSparkles className="w-8 h-8 text-primary text-bold fill-current" />
              <h2 className="font-bold text-xl text-primary">
                AI Image Generator
              </h2>
            </Link>

            {/* Right-side controls */}
            <div className="flex items-center gap-4 ml-auto">
              <ModeToggle />

              {isSignedIn ? (
                <>
                  <Button variant="outline" asChild size="sm">
                    <Link href="/explorer">Explorer</Link>
                  </Button>

                  {isLoaded ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Avatar className="h-8 w-8 cursor-pointer">
                          <AvatarImage src={user?.imageUrl} />
                          <AvatarFallback>
                            {user?.firstName?.charAt(0)}
                            {user?.lastName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => signOut()}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Skeleton className="h-8 w-8 rounded-full" />
                  )}
                </>
              ) : (
                <Button asChild size="sm">
                  <Link href="/explorer">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
