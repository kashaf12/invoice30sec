import type { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import HeroBackground from "@/components/HeroBackground";
import { inter } from "./fonts";
import "./globals.css";

// Lazy load below-the-fold components
const Footer = dynamic(() =>
  import("@/components/Footer").then((mod) => ({ default: mod.Footer }))
);
const Toaster = dynamic(() =>
  import("@/components/ui/sonner").then((mod) => ({ default: mod.Toaster }))
);

export const metadata: Metadata = {
  title: "Invoice30Sec - Get Paid Instantly | Fast Freelancer Invoicing",
  description:
    "Create payment-ready invoices in 30 seconds. Accept UPI, Stripe, PayPal, Razorpay, and bank transfers. Stop chasing payments. Built by a freelancer, for freelancers.",
  keywords: [
    "invoice",
    "freelancer",
    "payment",
    "UPI",
    "instant payment",
    "get paid fast",
    "freelancer invoicing",
    "payment methods",
    "invoice generator",
  ],
  authors: [{ name: "Invoice30Sec" }],
  creator: "Invoice30Sec",
  openGraph: {
    title: "Invoice30Sec - Get Paid Instantly",
    description:
      "The fastest way for freelancers to get paid. Create invoices with all payment methods in 30 seconds.",
    type: "website",
    locale: "en_US",
    siteName: "Invoice30Sec",
    url: "https://invoice30sec.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Invoice30Sec - Get Paid Instantly",
    description:
      "Create payment-ready invoices in 30 seconds. Stop chasing payments.",
    creator: "@kashafaahmed",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "I1LVuzN_vqAvkC_jMcJW4P1y1dVcWm-jDXB26G2rdJI",
  },
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
      <head>
        {/* Resource hints for performance */}
        <link rel="dns-prefetch" href="https://api.dicebear.com" />
        <link rel="preconnect" href="https://vitals.vercel-insights.com" />
        <link
          rel="preconnect"
          href="https://vercel-analytics.com"
          crossOrigin="anonymous"
        />
      </head>
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
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && window.dataLayer) {
                window.dataLayer = window.dataLayer || [];
              }
            `,
          }}
        />
        {process.env.NODE_ENV === "production" && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
