"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link2, Timer, TrendingUp, LucideIcon } from "lucide-react";

interface BenefitCard {
  icon: LucideIcon;
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
    icon: Link2,
    title: "All payment options. One clean link.",
    body: 'Your client sees every available method — UPI, Stripe, PayPal, Razorpay, or direct bank transfer. They pick what\'s fastest. No "How do I pay?" No confusion. No excuses.',
    micro: "No delays.",
  },
  {
    icon: Timer,
    title: "Create invoices in seconds, not hours.",
    body: "Add amount, a short description, and the due date. Everything else is automated — clean formatting, smart reminders (coming soon). Stop wasting hours designing invoices nobody reads.",
    micro: "Automated formatting & smart reminders (coming soon).",
  },
  {
    icon: TrendingUp,
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
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });
  const sectionRef = useRef<HTMLElement>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

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
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({ event: "why_cta_click" });
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
      className={`relative w-full py-12 md:py-24 overflow-hidden bg-transparent ${className}`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center z-10 relative">
        {/* Overline */}
        <span
          className={`text-sm uppercase tracking-widest text-muted-foreground mb-4 text-center transition-all duration-700 ease-out ${
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
          className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground text-center mb-12 max-w-4xl leading-tight transition-all duration-700 delay-100 ease-out ${
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
              className={`transition-all duration-400 ease-[cubic-bezier(0.2,0.9,0.2,1)] ${
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
                className="h-full bg-card border-border hover:border-primary/30 transition-colors"
              >
                <CardContent className="p-6 md:p-8 flex flex-col h-full">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <card.icon
                      className="w-6 h-6 text-primary"
                      aria-hidden="true"
                    />
                  </div>

                  {/* Card Title */}
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                    {card.title}
                  </h3>

                  {/* Card Body */}
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">
                    {card.body}
                  </p>

                  {/* Micro Emphasis */}
                  <p className="text-sm font-bold text-primary mt-auto">
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
          className={`text-base font-medium text-primary text-center hover:text-primary/90 transition-all duration-300 ease-out ${
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
      </div>
    </section>
  );
};
