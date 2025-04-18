"use client";

import * as React from "react";
import {
  IconFileDescription,
  IconLibraryPhoto,
  IconCirclePlus,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import SvgIcon from "./logo";

const data = {
  navMain: [
    {
      title: "Explorer",
      url: "/explorer",
      icon: IconLibraryPhoto,
    },
    {
      title: "Create New",
      url: "/explorer/create-new",
      icon: IconCirclePlus,
    },
    {
      title: "History",
      url: "/dashboard/history",
      icon: IconFileDescription,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="p-0 h-auto">
              <Link href="/" className="flex items-center gap-3 px-2 py-2">
                <SvgIcon
                  className="w-full h-full text-black dark:text-primary fill-current"
                  style={{ transform: "scale(1.8)" }}
                />
                <span className="text-base font-bold dark:text-primary text-black">
                  AI IMAGE GENERATOR
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
