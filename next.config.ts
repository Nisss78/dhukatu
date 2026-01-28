import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopackを無効化
  experimental: {
    turbo: undefined,
  },
};

export default nextConfig;
