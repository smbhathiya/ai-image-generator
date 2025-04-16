"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import SvgIcon from "./logo";

export const HeroHeader = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { isSignedIn } = useUser();

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
              {/* <Logo /> */}
              <SvgIcon className="w-8 h-8 text-primary text-bold fill-current" />
              <h2 className="font-bold text-xl text-primary">
                AI Image Generator
              </h2>
            </Link>

            {/* Auth & Theme */}
            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <Button asChild size="sm">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="sm">
                    <Link href="/dashboard">Sign In</Link>
                  </Button>
                </>
              )}
              <ModeToggle />
              <UserButton />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
