"use client";
import React from "react";
import { motion } from "framer-motion";

type SpotlightProps = {
  gradientFirst?: string;
  gradientSecond?: string;
  gradientThird?: string;
};

export const Spotlight = ({
  gradientFirst = "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .08) 0%, hsla(210, 100%, 80%, 0) 65.63%)",
  gradientSecond = "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .06) 0, hsla(210, 100%, 80%, 0) 85%)",
  gradientThird = "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .04) 0, hsla(210, 100%, 80%, 0) 85%)",
}: SpotlightProps = {}) => {
  // Static values that match between server and client
  const width = 300;
  const smallWidth = 150;
  const height = 600;
  const translateY = -160;
  const xOffset = 120;
  const duration = 7;

  // Use client-side only animation
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Create consistent style objects for both server and client
  const leftMainStyle = {
    transform: `translateY(${translateY}px) rotate(-45deg)`,
    backgroundImage: gradientFirst,
    width: `${width}px`,
    height: `${height}px`,
  };

  const leftSecondStyle = {
    transform: "rotate(-45deg) translate(5%, -50%)",
    backgroundImage: gradientSecond,
    width: `${smallWidth}px`,
    height: `${height}px`,
  };

  const leftThirdStyle = {
    transform: "rotate(-45deg) translate(-180%, -70%)",
    backgroundImage: gradientThird,
    width: `${smallWidth}px`,
    height: `${height}px`,
  };

  const rightMainStyle = {
    transform: `translateY(${translateY}px) rotate(45deg)`,
    backgroundImage: gradientFirst,
    width: `${width}px`,
    height: `${height}px`,
  };

  const rightSecondStyle = {
    transform: "rotate(45deg) translate(-5%, -50%)",
    backgroundImage: gradientSecond,
    width: `${smallWidth}px`,
    height: `${height}px`,
  };

  const rightThirdStyle = {
    transform: "rotate(45deg) translate(180%, -70%)",
    backgroundImage: gradientThird,
    width: `${smallWidth}px`,
    height: `${height}px`,
  };

  return (
    <div className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden">
      {isClient ? (
        // Only render motion elements on the client
        <>
          {/* Left Spotlight */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute top-0 left-0 h-full w-1/2 pointer-events-none"
          >
            <motion.div
              animate={{ x: [0, xOffset, 0] }}
              transition={{
                duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              <div style={leftMainStyle} className="absolute top-0 left-0" />
              <div
                style={leftSecondStyle}
                className="absolute top-0 left-0 origin-top-left"
              />
              <div
                style={leftThirdStyle}
                className="absolute top-0 left-0 origin-top-left"
              />
            </motion.div>
          </motion.div>

          {/* Right Spotlight */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute top-0 right-0 h-full w-1/2 pointer-events-none"
          >
            <motion.div
              animate={{ x: [0, -xOffset, 0] }}
              transition={{
                duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              <div style={rightMainStyle} className="absolute top-0 right-0" />
              <div
                style={rightSecondStyle}
                className="absolute top-0 right-0 origin-top-right"
              />
              <div
                style={rightThirdStyle}
                className="absolute top-0 right-0 origin-top-right"
              />
            </motion.div>
          </motion.div>
        </>
      ) : (
        // Static version for server rendering
        <>
          {/* Left Spotlight static */}
          <div className="absolute top-0 left-0 h-full w-1/2 pointer-events-none">
            <div style={leftMainStyle} className="absolute top-0 left-0" />
            <div
              style={leftSecondStyle}
              className="absolute top-0 left-0 origin-top-left"
            />
            <div
              style={leftThirdStyle}
              className="absolute top-0 left-0 origin-top-left"
            />
          </div>

          {/* Right Spotlight static */}
          <div className="absolute top-0 right-0 h-full w-1/2 pointer-events-none">
            <div style={rightMainStyle} className="absolute top-0 right-0" />
            <div
              style={rightSecondStyle}
              className="absolute top-0 right-0 origin-top-right"
            />
            <div
              style={rightThirdStyle}
              className="absolute top-0 right-0 origin-top-right"
            />
          </div>
        </>
      )}
    </div>
  );
};
