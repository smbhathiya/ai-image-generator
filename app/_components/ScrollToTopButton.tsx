"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconArrowBigUp } from "@tabler/icons-react";

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <Button
        onClick={scrollToTop}
        variant="outline"
        size="icon"
        className="w-14 h-14 rounded-full shadow-lg"
        aria-label="Scroll to top"
      >
        <IconArrowBigUp className="h-10 w-10" />
      </Button>
    </div>
  );
};
