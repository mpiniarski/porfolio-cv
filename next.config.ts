import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "playwright.dev" },
      { protocol: "https", hostname: "www.cursor.com" },
      { protocol: "https", hostname: "claude.ai" },
      { protocol: "https", hostname: "cdn.oaistatic.com" },
      { protocol: "https", hostname: "uxwing.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "logosandtypes.com" },
      { protocol: "https", hostname: "cotypist.app" },
    ],
  },
};

export default nextConfig;
