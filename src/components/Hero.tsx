"use client";

import dynamic from "next/dynamic";
import { Sparkles, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrustSignals } from "@/components/TrustSignals";

// Lazy load PaymentReadyInvoice - heavy component with motion animations
const PaymentReadyInvoice = dynamic(
  () =>
    import("@/components/PaymentReadyInvoice").then((mod) => ({
      default: mod.PaymentReadyInvoice,
    })),
  {
    loading: () => (
      <div className="w-full h-full bg-white/5 rounded-2xl animate-pulse border border-white/10" />
    ),
    ssr: true,
  }
);

interface HeroProps {
  className?: string;
}

export const Hero = ({ className = "" }: HeroProps) => {
  return (
    <section
      id="hero"
      aria-label="Hero"
      className={`relative w-full flex flex-col items-center justify-center ${className}`}
    >
      {/* Content Container - Two column layout on desktop, stacked on mobile */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div
          className={`relative z-10 w-full flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 transition-all duration-1000 ease-out transform ${"translate-y-0 opacity-100"}`}
        >
          {/* Text Content - Left column on desktop, top on mobile */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/2 gap-4 md:gap-6 lg:gap-8">
            {/* Overline */}
            <span
              className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              For freelancers
            </span>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] md:leading-tight tracking-tight max-w-[90%] md:max-w-[720px]">
              Instant invoices. Faster payments.
            </h1>

            {/* Subheadline */}
            <p className="text-base md:text-lg text-gray-300 max-w-[90%] md:max-w-[560px] leading-relaxed">
              30 seconds. One link. All payment methods.
            </p>

            {/* CTA Group - Isolated with spotlight effect */}
            <div className="relative w-full md:w-auto mt-4 md:mt-6">
              {/* Spotlight backdrop to isolate CTA from busy background */}
              <div
                className="absolute inset-0 -inset-x-8 -inset-y-6 md:-inset-x-12 md:-inset-y-8 -z-10 rounded-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse 600px 300px at 50% 50%, rgba(9, 213, 122, 0.15) 0%, rgba(9, 213, 122, 0.05) 40%, transparent 70%)",
                  filter: "blur(40px)",
                }}
                aria-hidden="true"
              />
              {/* CTA Buttons Container */}
              <div className="relative z-0 flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
                <Button
                  className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-2xl px-6 py-3 md:py-4 text-base md:text-lg shadow-lg w-full md:w-auto inline-flex items-center justify-center gap-3 min-h-[44px] cursor-pointer"
                  onClick={() =>
                    document
                      .getElementById("validation")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                  Get Early Access
                </Button>

                <Button
                  asChild
                  className="border border-white/10 text-white/80 hover:border-white/20 bg-transparent rounded-2xl px-5 py-3 md:py-4 text-base md:text-lg w-full md:w-auto inline-flex items-center justify-center gap-3 min-h-[44px]"
                >
                  <a href="#howitworks">
                    <PlayCircle className="w-5 h-5" aria-hidden="true" />
                    How It Works
                  </a>
                </Button>
              </div>
              <p className="text-xs md:text-sm text-gray-300 mt-2 text-center md:text-left">
                No credit card • 30-second setup
              </p>
            </div>

            {/* Trust Signals */}
            <div className="w-full">
              <TrustSignals />
            </div>
          </div>

          {/* Invoice Mockup - Right column on desktop, below on mobile */}
          <div className="w-full md:w-1/2 flex items-center md:justify-end justify-center mt-8 md:mt-0 overflow-visible">
            {/* Fixed aspect ratio container to prevent CLS - approximately 3:4 ratio for invoice */}
            <div className="w-full max-w-[85%] aspect-3/4 min-h-[500px] md:min-h-[600px] flex items-center justify-center">
              <PaymentReadyInvoice />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
