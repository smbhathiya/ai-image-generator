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
      url: "/explorer/history",
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
              <Link
                href="/"
                className="flex flex-col items-center gap-2 px-2 py-2"
              >
                <SvgIcon
                  className="w-6 h-6 text-black dark:text-primary fill-current"
                  style={{ transform: "scale(2.5)" }}
                />
                <span className="text-xl font-extrabold text-center dark:text-primary text-black leading-tight">
                  AI IMAGE
                  <br />
                  GENERATOR
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
