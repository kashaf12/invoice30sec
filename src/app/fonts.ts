import { Inter } from "next/font/google";

// Using next/font/google which automatically self-hosts and optimizes the font
// This avoids Turbopack issues with local fonts in Next.js 16.0.4
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ],
});
