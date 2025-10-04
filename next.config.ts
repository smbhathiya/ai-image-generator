import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // allow Vercel Blob domains or external blob urls if needed
        hostname: "*",
      },
    ],
  },
};

export default nextConfig;
