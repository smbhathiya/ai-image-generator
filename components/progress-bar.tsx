"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";

export default function ProgressBar() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => {
      NProgress.done();
    }, 500); // simulate loading delay

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
