import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  allowedDevOrigins: ["192.168.*.*", "localhost", "127.0.0.1"],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.imgur.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "imgur.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.imgbox.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "imgbox.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
