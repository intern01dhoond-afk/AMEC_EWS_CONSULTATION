import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  cacheComponents: true,
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
