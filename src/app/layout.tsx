import type { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import HeroBackground from "@/components/HeroBackground";
import { inter } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Invoice30Sec",
  description: "Get paid instantly.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover", // Required for safe-area-inset-top/bottom to work
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body
        className="antialiased min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        <HeroBackground />
        <Header />
        <div id="main-content" className="w-full flex-1 flex flex-col">
          {children}
        </div>
        <Footer />
        <Toaster />
        <Script
          id="analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && window.dataLayer) {
                window.dataLayer = window.dataLayer || [];
              }
            `,
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
