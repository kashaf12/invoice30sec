"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PulsatingButton } from "@/components/ui/pulsating-button";

interface HeroProps {
  className?: string;
}

export const Hero = ({ className = "" }: HeroProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      id="hero"
      aria-label="Hero"
      className={`relative w-full flex flex-col items-center justify-center text-center px-6 py-12 md:px-8 md:py-20 lg:px-16 lg:py-28 overflow-hidden ${className}`}
    >
      {/* Content Container */}
      <div
        className={`relative z-10 w-full max-w-[760px] flex flex-col items-center gap-6 md:gap-8 transition-all duration-1000 ease-out transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Overline */}
        <span className="text-[#C9C9C9] text-xs md:text-sm font-bold tracking-[0.2em] uppercase">
          Built by a freelancer, for freelancers
        </span>

        {/* Headline */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
          Send invoices your clients can pay instantly.
        </h1>

        {/* Subheadline */}
        <p className="text-base md:text-lg text-[#C9C9C9] max-w-2xl leading-relaxed">
          Create a clean invoice in 30 seconds with all your payment methods in
          one link. No excuses. No chasing. Just instant payments.
        </p>

        {/* CTA Group */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto mt-4">
          <PulsatingButton
            className="bg-[#21D07A] text-white font-bold text-lg w-full md:w-auto"
            pulseColor="#336c51ff"
            onClick={() =>
              document
                .getElementById("validation")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Get Early Access
          </PulsatingButton>

          <Button
            asChild
            variant="outline"
            className="w-full md:w-auto px-6 py-6 text-base md:text-lg bg-transparent border-white text-white hover:bg-white/10 active:scale-98 transition-all duration-200"
          >
            <a href="#howitworks">How It Works</a>
          </Button>
        </div>
      </div>
    </section>
  );
};
