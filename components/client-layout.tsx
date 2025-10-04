"use client";

import { useState, useEffect } from "react";
import Loader from "@/components/ui/loader";
import BottomNav from "@/components/ui/bottom-nav";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  useEffect(() => {
    if (document.readyState === "complete") {
      setIsAppLoaded(true);
    } else {
      const handleLoad = () => setIsAppLoaded(true);
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  if (!isAppLoaded) {
    return <Loader />;
  }

  return <>{children}</>;
}

// Wrap children with BottomNav for mobile
export function ClientLayoutWithNav({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}
