"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { type Icon } from "@tabler/icons-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronDown, ChevronUp } from "lucide-react";

type SecondaryNavItem = {
  title: string;
  icon?: Icon;
  children?: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
};

export function NavMenu({ items }: { items: SecondaryNavItem[] }) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (title: string) => {
    if (isCollapsed) return;
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isOpen = openMenus[item.title] || false;
            const hasChildren = item.children && item.children.length > 0;

            return (
              <SidebarMenuItem key={item.title}>
                {hasChildren ? (
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => toggleMenu(item.title)}
                    className={`flex items-center justify-between px-4 py-3 rounded-md transition-colors hover:bg-muted/20 ${
                      isCollapsed ? "justify-center" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {item.icon && (
                        <item.icon className="h-5 w-5 min-w-[20px] min-h-[20px]" />
                      )}
                      {!isCollapsed && <span>{item.title}</span>}
                    </div>
                    {hasChildren &&
                      !isCollapsed &&
                      (isOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </SidebarMenuButton>
                ) : (
                  <Link href={`/explorer/${item.title.toLowerCase()}`}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={`flex items-center justify-between px-4 py-3 rounded-md transition-colors hover:bg-muted/20 ${
                        isCollapsed ? "justify-center" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {item.icon && (
                          <item.icon className="h-5 w-5 min-w-[20px] min-h-[20px]" />
                        )}
                        {!isCollapsed && <span>{item.title}</span>}
                      </div>
                    </SidebarMenuButton>
                  </Link>
                )}

                {isOpen && hasChildren && !isCollapsed && item.children && (
                  <SidebarMenuSub className="pl-10 mt-2 flex flex-col gap-1">
                    {item.children.map((child) => {
                      const isActive = pathname === child.url;

                      return (
                        <SidebarMenuSubItem key={child.title}>
                          <Link href={child.url}>
                            <SidebarMenuButton
                              tooltip={child.title}
                              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${
                                isActive
                                  ? "dark:bg-muted dark:text-white bg-neutral-200"
                                  : "hover:bg-muted/10"
                              }`}
                            >
                              {child.icon && <child.icon className="h-4 w-4" />}
                              <span>{child.title}</span>
                            </SidebarMenuButton>
                          </Link>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
