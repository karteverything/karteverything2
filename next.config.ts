import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* anti-click-jacking protection */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key:"X-Content-Type-Options",
            value:"nosniff",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
