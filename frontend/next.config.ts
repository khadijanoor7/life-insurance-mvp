import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://backend:5001/api/:path*", // Proxy to backend container in Docker
      },
    ];
  },
};

export default nextConfig;
