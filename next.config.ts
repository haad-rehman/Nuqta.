import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve modern formats; the optimizer negotiates per Accept header.
    formats: ["image/avif", "image/webp"],
  },
  compiler: {
    // Strip console.* in production builds, but keep console.error for prod diagnostics.
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  experimental: {
    // Tree-shake large barrel packages so only used icons/modules ship.
    optimizePackageImports: ["lucide-react", "gsap"],
  },
  async headers() {
    return [
      {
        // Long-lived immutable caching for fingerprinted/static media + fonts.
        source: "/:all*(woff2|mp4|webm|avif|webp|png|jpg|jpeg|svg)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
