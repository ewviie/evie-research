import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // One canonical URL form for every page: /path/ (matches canonicals, sitemap, feeds).
  trailingSlash: true,
  poweredByHeader: false,
  turbopack: { root: __dirname },
  reactStrictMode: true,

  // 301s for moved or renamed content. Add old -> new pairs here when you rename a slug, e.g.
  // { source: "/research/old-slug/", destination: "/research/new-slug/", statusCode: 301 }
  async redirects() {
    return [
      { source: "/research", destination: "/archive/", statusCode: 301 },
      { source: "/blog", destination: "/archive/", statusCode: 301 },
      { source: "/tags", destination: "/archive/", statusCode: 301 },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
