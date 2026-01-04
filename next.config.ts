import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Static export לשרת PHP
  images: {
    unoptimized: true, // נדרש ל-static export
    formats: ['image/avif', 'image/webp'],
  },
  // הוסר redirect - הדף הראשי נמצא כעת ישירות ב-/
  // API routes לא נכללים ב-static export - משתמשים ב-PHP בשרת ייצור
  distDir: '.next',
  // התעלם מתיקיות API שלא תואמות ל-static export
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

export default nextConfig;