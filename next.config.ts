import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // allow Next.js image optimization on Vercel
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
  },
  // הוסר redirect - הדף הראשי נמצא כעת ישירות ב-/
  distDir: '.next',
  // התעלם מתיקיות API שלא תואמות ל-static export
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // הגדרות Turbopack
  turbopack: {},
};

export default nextConfig;