import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PDF.js resolves its worker from node_modules at runtime. Externalizing the
  // package prevents Turbopack from relocating the worker away from that path.
  serverExternalPackages: ["pdfjs-dist"],
};

export default nextConfig;
