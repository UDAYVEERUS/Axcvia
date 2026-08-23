import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // Course thumbnails migrated from the WordPress site (scripts/import-airship.mjs).
      {
        protocol: "https",
        hostname: "www.airshipaviation.com",
      },
    ],
  },
};

export default nextConfig;
