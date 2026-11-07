import type { NextConfig } from "next";

function apiUrl() {
  const raw =
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    (process.env.NODE_ENV === "production" ? "" : "http://localhost:5555");

  const url = raw.trim().replace(/^["']|["']$/g, "").replace(/\/+$/, "");

  if (!/^https?:\/\//.test(url)) {
    throw new Error(
      `ตั้งค่า API_URL บน Vercel ให้ขึ้นต้นด้วย https:// (ตอนนี้: "${url}") แล้ว Redeploy`,
    );
  }
  return url;
}

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${apiUrl()}/:path*` }];
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;