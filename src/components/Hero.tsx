"use client";

import React from "react";
import { Sparkles, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PulsatingButton } from "@/components/ui/pulsating-button";
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
          className={`relative z-10 w-full flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16 transition-all duration-1000 ease-out transform ${"translate-y-0 opacity-100"}`}
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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
              Send invoices your clients can pay instantly.
            </h1>

            {/* Subheadline */}
            <p
              className="text-base md:text-lg max-w-2xl leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
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
                <PulsatingButton
                  className="text-black font-bold text-lg md:text-xl w-full md:w-auto whitespace-nowrap px-4 py-3 md:px-5 md:py-3 shadow-[0_0_40px_rgba(9,213,122,0.4),0_0_80px_rgba(9,213,122,0.2)] hover:shadow-[0_0_50px_rgba(9,213,122,0.5),0_0_100px_rgba(9,213,122,0.3)] transition-all duration-300 scale-100 hover:scale-105 active:scale-95"
                  pulseColor="var(--brand-pulse)"
                  onClick={() =>
                    document
                      .getElementById("validation")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                  Get Early Access
                </PulsatingButton>

                <Button
                  asChild
                  variant="outline"
                  className="w-full md:w-auto px-6 py-6 text-base md:text-lg bg-transparent border-white text-white hover:bg-white/10 active:scale-98 transition-all duration-200"
                >
                  <a href="#howitworks" className="flex items-center gap-2">
                    <PlayCircle className="w-5 h-5" aria-hidden="true" />
                    How It Works
                  </a>
                </Button>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="w-full">
              <TrustSignals />
            </div>
          </div>

          {/* Invoice Mockup - Right column on desktop, below on mobile */}
          <div className="w-full md:w-1/2 flex items-center md:justify-end justify-center">
            <PaymentReadyInvoice className="max-w-md" />
          </div>
        </div>
      </div>
    </section>
  );
};
