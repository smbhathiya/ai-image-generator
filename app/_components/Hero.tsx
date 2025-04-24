"use client";
import { Spotlight } from "./SpotLight";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconArrowBigRight, IconSparkles } from "@tabler/icons-react";

export default function Hero() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setIsLoading(true);
    router.push("explorer");
  };


  return (
    <section className="flex items-center justify-center text-center min-h-screen py-24 overflow-hidden">
      <Spotlight />

      <div className="container px-4 max-w-3xl relative z-10">
        <div className="mb-4">
          <IconSparkles className="w-12 h-12 text-primary mx-auto animate-[bounce_3s_infinite]" />
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
