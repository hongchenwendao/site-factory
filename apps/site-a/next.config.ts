import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "cdn.sanity.io",
        protocol: "https",
      },
      {
        hostname: "images.unsplash.com",
        protocol: "https",
      },
    ],
  },
  transpilePackages: ["@site-factory/sanity", "@site-factory/seo", "@site-factory/ui"],
};

export default nextConfig;
