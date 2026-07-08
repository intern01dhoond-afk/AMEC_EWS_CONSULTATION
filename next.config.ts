import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  basePath: '/ews',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/ews',
        basePath: false,
        permanent: false,
      },
      {
        source: '/checkout',
        destination: '/ews/checkout',
        basePath: false,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
