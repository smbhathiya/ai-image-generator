"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CTA() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleClick = () => {
    setIsLoading(true);
    router.push("explorer/create-new");
  };
  return (
    <section className="py-24 bg-primary text-white text-center rounded-xl m-4">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">
          Ready to bring your ideas to life?
        </h2>
        <p className="mb-6 text-white/90">
          Start generating amazing images with the power of AI.
        </p>
        <button
          onClick={handleClick}
          className={`bg-white text-primary font-semibold px-6 py-3 rounded-lg shadow hover:bg-white/90 transition-all ${
            isLoading ? "cursor-progress opacity-80" : "cursor-pointer"
          }`}
          disabled={isLoading}
        >
          Try it now
        </button>
      </div>
    </section>
  );
}
