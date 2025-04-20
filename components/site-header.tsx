"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {  useUser } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function SiteHeader() {
  const { user } = useUser();
  const isLoading = !user;

  return (
    <header className="flex h-(--header-height) bg-sidebar shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          {isLoading ? (
            <Skeleton className="h-7 w-7 rounded-full" />
          ) : (
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </header>
  );
}
