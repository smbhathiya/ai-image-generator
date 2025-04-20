"use client";

import * as React from "react";
import {
  IconHistory,
  IconCompass,
  IconCirclePlus,
  IconSparkles,
  IconSettings,
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
import { useAuth } from "@clerk/nextjs";

const data = {
  navMain: [
    {
      title: "Explorer",
      url: "/explorer",
      icon: IconCompass,
    },
    {
      title: "Create New",
      url: "/explorer/create-new",
      icon: IconCirclePlus,
    },
    {
      title: "History",
      url: "/explorer/history",
      icon: IconHistory,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userId } = useAuth();
  const adminNav = userId
    ? [
        {
          title: "Manage",
          url: "/explorer/manage",
          icon: IconSettings,
        },
      ]
    : [];
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="p-4 h-auto">
              <Link
                href="/"
                className="flex flex-row items-center gap-4 px-2 py-2"
              >
                <IconSparkles
                  className="text-primary"
                  style={{ transform: "scale(1.5)" }}
                />
                <span className="text-lg font-bold text-primary  leading-tight">
                  AI Image Generator
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={[...data.navMain, ...adminNav]} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
