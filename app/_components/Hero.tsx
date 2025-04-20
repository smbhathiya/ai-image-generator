"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Spotlight } from "./SpotLight";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconArrowBigRight } from "@tabler/icons-react";
import { useTheme } from "next-themes";

export default function Hero() {
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();

  const handleClick = () => {
    setIsLoading(true);
    router.push("explorer/create-new");
  };

  const isDark = theme === "dark";

  return (
    <section className="flex items-center justify-center text-center min-h-screen py-24 overflow-hidden">
      {/* Spotlight animation background */}
      <Spotlight
        gradientFirst={
          isDark
            ? "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .08) 0, hsla(210, 100%, 55%, .02) 50%, hsla(210, 100%, 45%, 0) 80%)"
            : "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .15) 0, hsla(210, 100%, 55%, .07) 50%, hsla(210, 100%, 45%, 0) 80%)"
        }
        gradientSecond={
          isDark
            ? "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .06) 0, hsla(210, 100%, 55%, .02) 80%, transparent 100%)"
            : "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .10) 0, hsla(210, 100%, 55%, .06) 80%, transparent 100%)"
        }
        gradientThird={
          isDark
            ? "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .04) 0, hsla(210, 100%, 45%, .02) 80%, transparent 100%)"
            : "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .08) 0, hsla(210, 100%, 45%, .05) 80%, transparent 100%)"
        }
      />

      <div className="container px-4 max-w-3xl relative z-10">
        <div className="mb-4">
          <Sparkles className="w-12 h-12 text-primary mx-auto animate-[bounce_3s_infinite]" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-primary">
          Turn Your Imagination into Images with AI
        </h1>

        <p className="text-muted-foreground text-lg mb-8">
          Generate high-quality visuals from text in seconds. No design skills
          needed.
        </p>

        <Button
          onClick={handleClick}
          size={"lg"}
          className={`cursor-pointer ${
            isLoading ? "cursor-progress opacity-80" : "cursor-pointer"
          }`}
          disabled={isLoading}
        >
          Start Creating
          <IconArrowBigRight />
        </Button>
      </div>
    </section>
  );
}
