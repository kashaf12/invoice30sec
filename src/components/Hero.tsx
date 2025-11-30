"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PulsatingButton } from "@/components/ui/pulsating-button";
import { PaymentReadyInvoice } from "@/components/PaymentReadyInvoice";

interface HeroProps {
  className?: string;
}

export const Hero = ({ className = "" }: HeroProps) => {
  return (
    <section
      id="hero"
      aria-label="Hero"
      className={`relative w-full flex flex-col items-center justify-center px-6 py-12 md:px-8 md:py-20 lg:px-16 lg:py-28 overflow-hidden ${className}`}
    >
      {/* Content Container - Two column layout on desktop, stacked on mobile */}
      <div
        className={`relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16 transition-all duration-1000 ease-out transform ${"translate-y-0 opacity-100"}`}
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

          {/* CTA Group */}
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto mt-4">
            <PulsatingButton
              className="font-bold text-lg w-full md:w-auto whitespace-nowrap"
              style={{ 
                backgroundColor: "var(--brand-primary-alt)",
                color: "var(--text-on-primary)"
              }}
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

        {/* Invoice Mockup - Right column on desktop, below on mobile */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <PaymentReadyInvoice />
        </div>
      </div>
    </section>
  );
};
