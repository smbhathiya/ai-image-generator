"use client";
import React from "react";
import { motion } from "framer-motion";

type SpotlightProps = {
  gradientFirst?: string;
  gradientSecond?: string;
  gradientThird?: string;
};

// Hook to get window size
const useWindowSize = () => {
  const [windowSize, setWindowSize] = React.useState({
    width: 1200, // Default for SSR
    height: 800, // Default for SSR
  });

  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize(); // Set initial size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

export const Spotlight = ({
  gradientFirst = "radial-gradient(80% 80% at 55.02% 31.46%, color-mix(in oklch, var(--primary) 10%, oklch(0.95 0.01 16.439)) 0, color-mix(in oklch, var(--primary) 5%, transparent) 60%, transparent 90%)",
  gradientSecond = "radial-gradient(60% 60% at 50% 50%, color-mix(in oklch, var(--primary) 8%, oklch(0.95 0.01 16.439)) 0, color-mix(in oklch, var(--primary) 3%, transparent) 85%, transparent 100%)",
  gradientThird = "radial-gradient(60% 60% at 50% 50%, color-mix(in oklch, var(--primary) 6%, oklch(0.95 0.01 16.439)) 0, color-mix(in oklch, var(--primary) 2%, transparent) 85%, transparent 100%)",
}: SpotlightProps = {}) => {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const [isMounted, setIsMounted] = React.useState(false);

  // Set isMounted to true only on client-side
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use static defaults for SSR, dynamic values only on client
  const width = isMounted ? Math.min(300, windowWidth * 0.4) : 300;
  const smallWidth = isMounted ? Math.min(150, windowWidth * 0.2) : 150;
  const height = isMounted ? Math.min(600, windowHeight * 1.5) : 600;
  const translateY = isMounted ? -(windowHeight * 0.2) : -160; // Match SSR value from error
  const xOffset = isMounted ? windowWidth * 0.1 : 120; // Default based on 1200px width
  const duration = 7;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
    >
      {/* Left Spotlight */}
      <motion.div
        animate={{ x: [0, xOffset, 0] }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 h-full w-1/2 pointer-events-none"
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(-45deg)`,
            background: gradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 left-0"
        />
        <div
          style={{
            transform: "rotate(-45deg) translate(5%, -50%)",
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 left-0 origin-top-left"
        />
        <div
          style={{
            transform: "rotate(-45deg) translate(-180%, -70%)",
            background: gradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 left-0 origin-top-left"
        />
      </motion.div>

      {/* Right Spotlight */}
      <motion.div
        animate={{ x: [0, -xOffset, 0] }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute top-0 right-0 h-full w-1/2 pointer-events-none"
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(45deg)`,
            background: gradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 right-0"
        />
        <div
          style={{
            transform: "rotate(45deg) translate(-5%, -50%)",
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 right-0 origin-top-right"
        />
        <div
          style={{
            transform: "rotate(45deg) translate(180%, -70%)",
            background: gradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 right-0 origin-top-right"
        />
      </motion.div>
    </motion.div>
  );
};
