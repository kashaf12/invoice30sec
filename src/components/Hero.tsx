"use client";

import React from "react";
import { Sparkles, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentReadyInvoice } from "@/components/PaymentReadyInvoice";
import { TrustSignals } from "@/components/TrustSignals";

interface HeroProps {
  className?: string;
}

export const Hero = ({ className = "" }: HeroProps) => {
  return (
    <section
      id="hero"
      aria-label="Hero"
      className={`relative w-full flex flex-col items-center justify-center pt-24 pb-12 md:pt-28 md:pb-20 lg:pt-32 lg:pb-28 overflow-hidden ${className}`}
    >
      {/* Content Container - Two column layout on desktop, stacked on mobile */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div
          className={`relative z-10 w-full flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 transition-all duration-1000 ease-out transform ${"translate-y-0 opacity-100"}`}
        >
          {/* Text Content - Left column on desktop, top on mobile */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/2 gap-6 md:gap-8">
            {/* Overline */}
            <span
              className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase"
              style={{ color: "var(--text-secondary)" }}
            >
              Built by a freelancer, for freelancers
            </span>

            {/* Headline */}
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight max-w-[320px] md:max-w-[720px]">
              Send invoices your clients can pay instantly.
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-gray-300 max-w-[560px] leading-relaxed">
              Create a clean invoice in 30 seconds with all your payment methods
              in one link. No excuses. No chasing. Just instant payments.
            </p>

            {/* CTA Group - Isolated with spotlight effect */}
            <div className="relative w-full md:w-auto mt-4">
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
                  className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-2xl px-6 py-3 shadow-lg w-full md:w-auto inline-flex items-center gap-3"
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
                  className="border border-white/10 text-white/80 hover:border-white/20 bg-transparent rounded-2xl px-5 py-3 w-full md:w-auto inline-flex items-center gap-3"
                >
                  <a href="#howitworks">
                    <PlayCircle className="w-5 h-5" aria-hidden="true" />
                    How It Works
                  </a>
                </Button>
              </div>
              <p className="text-xs text-gray-300 mt-2">
                No credit card required • 30-second setup
              </p>
            </div>

            {/* Trust Signals */}
            <div className="w-full">
              <TrustSignals />
            </div>
          </div>

          {/* Invoice Mockup - Right column on desktop, below on mobile */}
          <div className="w-full md:w-1/2 flex items-center md:justify-end justify-center">
            <PaymentReadyInvoice />
          </div>
        </div>
      </div>
    </section>
  );
};
