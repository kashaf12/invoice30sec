import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Invoice30Sec",
  description: "Get paid instantly.",
};

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import HeroBackground from "@/components/HeroBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <HeroBackground />
        <Header />
        <div id="main-content" className="w-full flex-1 flex flex-col">
          {children}
        </div>
        <Footer />
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}
