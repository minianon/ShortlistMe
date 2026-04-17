import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent webpack from bundling these packages for server-side code.
  // They must run as native Node.js modules so that pdfjs-dist can
  // properly resolve its worker file at runtime without webpack interference.
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
};

export default nextConfig;
