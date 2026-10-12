import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    root: __dirname,
  },
  experimental: {
    /** Panelden galeri fotoğrafı yükleme; dosyalar tek tek gönderilir (`GALLERY_MAX_UPLOAD_BYTES`). */
    serverActions: { bodySizeLimit: "16mb" },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 828, 1080, 1280, 1600, 1920, 2400],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  /** Taşınan katalog adresleri; hedefler doğrudan son adrestir (zincir yok). */
  async redirects() {
    return [
      { source: "/yedek-parca/marka/:brand", destination: "/yedek-parca/:brand", statusCode: 301 },
      { source: "/yedek-parca/kategori/:id", destination: "/yedek-parca/:id", statusCode: 301 },
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
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
