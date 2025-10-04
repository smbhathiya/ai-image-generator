"use client";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { Settings } from "lucide-react";


export function SiteHeader() {
  return (
    <header className="flex h-12 items-center bg-background/50 px-4">
      <div className="flex w-full items-center gap-1 lg:gap-2 lg:px-6">
        <div className="text-lg font-semibold">AI Image Generator</div>
        <div className="ml-auto flex items-center gap-2">
          <Separator orientation="vertical" className="mx-2 h-6" />
          <ModeToggle />
          <Link
            href="/settings"
            className="inline-flex items-center px-2 py-1 rounded hover:bg-muted/40"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </header>
  );
}
