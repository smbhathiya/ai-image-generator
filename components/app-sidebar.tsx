"use client";

import * as React from "react";
import {
  IconFileDescription,
  IconLayoutDashboardFilled,
  IconLibraryPhoto,
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
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconLayoutDashboardFilled,
    },
    {
      title: "Collection",
      url: "/dashboard/collection",
      icon: IconLibraryPhoto,
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
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="p-0 h-auto">
              <Link href="/" className="flex items-center gap-3 px-2 py-2">
                <SvgIcon
                  className="w-full h-full text-black dark:text-white fill-current"
                  style={{ transform: "scale(1.8)" }}
                />
                <span className="text-base font-bold dark:text-white text-black">
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
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
