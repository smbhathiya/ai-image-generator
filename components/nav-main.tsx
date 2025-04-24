"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { type Icon } from "@tabler/icons-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url;

            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`flex items-center gap-4 px-4 py-3 rounded-md transition-colors h-10
                      ${
                        isActive
                          ? "dark:bg-muted dark:hover:bg-muted/50 dark:hover:text-white dark:text-white bg-neutral-200"
                          : ""
                      } 
                      cursor-pointer`}
                  >
                    {item.icon && (
                      <item.icon className="h-5 w-5 min-w-[20px] min-h-[20px]" />
                    )}

                    <span className="text-sm">{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
