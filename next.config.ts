import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Article hero photos are hotlinked from stock CDNs (frontmatter `image`
    // field, see src/lib/articles.ts). `search` omitted on purpose: these CDN
    // URLs carry sizing/signature query params.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
  async redirects() {
    // Articles moved under Resources (2026-08). The old URLs are live in
    // production — indexed, in the deployed RSS feed and sitemap — so these
    // are permanent (308). feed.xml must precede :slug or the slug pattern
    // swallows it. Composes with the apex→www redirect in src/middleware.ts:
    // config redirects run first, the host redirect applies on the follow-up.
    return [
      {
        source: "/articles",
        destination: "/resources/articles",
        permanent: true,
      },
      {
        source: "/articles/feed.xml",
        destination: "/resources/articles/feed.xml",
        permanent: true,
      },
      {
        source: "/articles/:slug",
        destination: "/resources/articles/:slug",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self'",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
