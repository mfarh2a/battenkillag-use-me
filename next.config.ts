import type { NextConfig } from "next";

const redirectsList = [
  { source: "/about", destination: "/why-battenkill", permanent: true },
  { source: "/why-orra", destination: "/why-battenkill", permanent: true },
];
const nextConfig: NextConfig = {
  // Public domain USDA photos are served through Vercel's image optimizer.
  images: { remotePatterns: [{ protocol: "https", hostname: "live.staticflickr.com" }] },
  // Make sure the checklist file ships with the download endpoint.
  outputFileTracingIncludes: { "/api/checklist": ["./content/downloads/**"] },
  poweredByHeader: false,
  async redirects() {
    return redirectsList;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
