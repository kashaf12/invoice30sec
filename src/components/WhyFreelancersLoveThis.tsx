"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface BenefitCard {
  title: string;
  body: string;
  micro: string;
}

interface WhyFreelancersLoveThisProps {
  className?: string;
  cards?: BenefitCard[];
  onCTAClick?: () => void;
}

const DEFAULT_CARDS: BenefitCard[] = [
  {
    title: "All payment options. One clean link.",
    body: "Your client sees every available method — UPI, Stripe, PayPal, Razorpay, or direct bank transfer. They pick what's fastest. No \"How do I pay?\" No confusion. No excuses.",
    micro: "No delays.",
  },
  {
    title: "Create invoices in seconds, not hours.",
    body: "Add amount, a short description, and the due date. Everything else is automated — clean formatting, smart reminders (coming soon). Stop wasting hours designing invoices nobody reads.",
    micro: "Automated formatting & smart reminders (coming soon).",
  },
  {
    title: "You send the link. The money comes in.",
    body: "Your client taps once. Money arrives. No delays. No reminders. No excuses.",
    micro: "Focus on work — not collecting payments.",
  },
];

export const WhyFreelancersLoveThis = ({
  className = "",
  cards = DEFAULT_CARDS,
  onCTAClick,
}: WhyFreelancersLoveThisProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleCTAClick = () => {
    if (onCTAClick) {
      onCTAClick();
    }
    // Analytics tracking
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: "why_cta_click" });
    }
  };

  // Determine if animations should play
  const shouldAnimate = !prefersReducedMotion;

  return (
    <section
      id="why"
      ref={sectionRef}
      aria-labelledby="why-heading"
      role="region"
      data-analytics-section="why-freelancers-love-this"
      className={`relative w-full py-12 md:py-24 px-6 md:px-8 overflow-hidden bg-transparent ${className}`}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center z-10 relative">
        {/* Overline */}
        <span
          className={`text-sm uppercase tracking-widest text-gray-400 mb-4 text-center transition-all duration-700 ease-out ${
            shouldAnimate && isVisible
              ? "opacity-100 translate-y-0"
              : shouldAnimate
              ? "opacity-0 translate-y-4"
              : "opacity-100"
          }`}
        >
          WHY FREELANCERS LOVE THIS.
        </span>

        {/* Headline */}
        <h2
          id="why-heading"
          className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white text-center mb-12 max-w-4xl leading-tight transition-all duration-700 delay-100 ease-out ${
            shouldAnimate && isVisible
              ? "opacity-100 translate-y-0 scale-100"
              : shouldAnimate
              ? "opacity-0 translate-y-8 scale-95"
              : "opacity-100 scale-100"
          }`}
        >
          Get paid instantly — without awkward conversations ever again.
        </h2>

        {/* Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full mb-12">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className={`transition-all duration-[400ms] ease-[cubic-bezier(0.2,0.9,0.2,1)] ${
                shouldAnimate && isVisible
                  ? "opacity-100 translate-y-0"
                  : shouldAnimate
                  ? "opacity-0 translate-y-3"
                  : "opacity-100"
              }`}
              style={
                shouldAnimate
                  ? { transitionDelay: `${200 + index * 80}ms` }
                  : undefined
              }
            >
              <Card
                tabIndex={0}
                aria-label={`Benefit: ${card.title}`}
                className="h-full bg-[#131619] border-white/5 hover:border-[#00E389]/20 transition-colors"
              >
                <CardContent className="p-6 md:p-8 flex flex-col h-full">
                  {/* Card Title */}
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                    {card.title}
                  </h3>

                  {/* Card Body */}
                  <p className="text-base text-[#C9C9C9] leading-relaxed mb-4">
                    {card.body}
                  </p>

                  {/* Micro Emphasis */}
                  <p className="text-sm font-bold text-[#21D07A] mt-auto">
                    {card.micro}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Micro-CTA */}
        <a
          href="#validation"
          onClick={handleCTAClick}
          className={`text-base text-[#09d57a] font-medium text-center hover:text-[#0bf58a] hover:drop-shadow-[0_0_8px_rgba(9,213,122,0.4)] transition-all duration-300 ease-out ${
            shouldAnimate && isVisible
              ? "opacity-100 translate-y-0"
              : shouldAnimate
              ? "opacity-0 translate-y-4"
              : "opacity-100"
          }`}
          style={shouldAnimate ? { transitionDelay: "440ms" } : undefined}
        >
          Join the waitlist and never chase payments again →
        </a>
      </div>
    </section>
  );
};
