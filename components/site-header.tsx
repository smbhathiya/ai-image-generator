"use client";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "./mode-toggle";

export function SiteHeader() {
  return (
    <header className="flex h-12 items-center bg-background/50 px-4">
      <div className="flex w-full items-center gap-1 lg:gap-2 lg:px-6">
        <div className="text-lg font-semibold">AI Image Generator</div>
        <div className="ml-auto flex items-center gap-2">
          <Separator orientation="vertical" className="mx-2 h-6" />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
