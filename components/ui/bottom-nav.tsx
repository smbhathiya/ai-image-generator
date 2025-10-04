"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ImageIcon, Grid, Clock } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const items = [
    { href: "/", label: "Home", icon: Home },
    { href: "/create", label: "Create", icon: ImageIcon },
    { href: "/explorer", label: "Explore", icon: Grid },
    { href: "/explorer/history", label: "History", icon: Clock },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 z-[70] w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 rounded-xl bg-popover/90 backdrop-blur-md border border-border px-3 py-2 shadow-lg">
      <ul className="flex justify-between gap-2">
        {items.map((it) => {
          const Icon = it.icon;
          const active =
            pathname === it.href || pathname?.startsWith(it.href + "/");
          return (
            <li key={it.href} className="flex-1">
              <Link
                href={it.href}
                className={`flex flex-col items-center gap-1 py-2 px-2 rounded-md ${
                  active ? "bg-primary/10 text-primary" : "text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
