import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Unofficial TikTok LIVE client used by /api/tiktok-live; keep it out of the bundle.
  serverExternalPackages: ['tiktok-live-connector'],
};

export default nextConfig;
