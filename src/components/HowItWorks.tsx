"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FileText, Wallet, Zap, LucideIcon } from "lucide-react";

interface HowItWorksProps {
  className?: string;
}

interface Step {
  icon: LucideIcon;
  title: string;
  body: string[];
}

const STEPS: Step[] = [
  {
    icon: FileText,
    title: "1. Create your invoice in 30 seconds.",
    body: [
      "Add amount, a short description, and the due date — that's it.",
      "No templates. No setup. No friction.",
    ],
  },
  {
    icon: Wallet,
    title: "2. Add how you want to get paid.",
    body: [
      "UPI, Stripe, Razorpay, PayPal, or direct bank transfer.",
      "Your client sees all available options — they pick the fastest one.",
    ],
  },
  {
    icon: Zap,
    title: "3. Send one link. Get paid instantly.",
    body: [
      "Your client taps once.",
      "Money arrives.",
      "No delays. No reminders. No excuses.",
    ],
  },
];

export const HowItWorks = ({ className = "" }: HowItWorksProps) => {
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

  // Determine if animations should play
  const shouldAnimate = !prefersReducedMotion;

  return (
    <section
      id="how"
      ref={sectionRef}
      aria-labelledby="how-heading"
      role="region"
      className={`relative w-full py-12 md:py-24 overflow-hidden bg-transparent ${className}`}
    >
      {/* Radial glow behind heading */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#11d07a]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center z-10 relative">
          {/* Overline */}
          <motion.span
            initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
            animate={shouldAnimate && isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-sm uppercase tracking-widest text-muted-foreground mb-4 text-center"
          >
            How It Works
          </motion.span>

          {/* Headline */}
          <motion.h2
            id="how-heading"
            initial={shouldAnimate ? { opacity: 0, y: 30 } : false}
            animate={shouldAnimate && isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground text-center mb-12 max-w-4xl leading-tight relative"
          >
            Instant payments in 3 steps — no chasing, ever again.
          </motion.h2>

          {/* Steps Grid */}
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full mb-12">
            {STEPS.map((step, index) => (
              <motion.div
                key={index}
                initial={shouldAnimate ? { opacity: 0, y: 40 } : false}
                animate={shouldAnimate && isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: shouldAnimate ? 0.2 + index * 0.1 : 0,
                  ease: "easeOut",
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="h-full"
              >
                <Card
                  tabIndex={0}
                  aria-label={`Step ${index + 1}: ${step.title}`}
                  className="h-full bg-card border border-white/5 rounded-xl hover:border-[#11d07a]/20 hover:shadow-[0_0_20px_rgba(17,208,122,0.1)] transition-all duration-300 group"
                >
                  <CardContent className="p-6 md:p-8 flex flex-col h-full">
                    {/* Icon - Monochrome, above title */}
                    <div className="mb-6 flex justify-center">
                      <step.icon
                        className="w-8 h-8 text-foreground/60 group-hover:text-foreground/80 transition-colors duration-300"
                        aria-hidden="true"
                      />
                    </div>

                    {/* Step Heading */}
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 text-center">
                      {step.title}
                    </h3>

                    {/* Step Body */}
                    <div className="flex flex-col gap-3 text-base text-muted-foreground leading-relaxed flex-grow">
                      {step.body.map((line, i) => (
                        <p key={i} className="text-center">
                          {line}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Tagline */}
          <motion.p
            initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
            animate={shouldAnimate && isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.6,
              delay: shouldAnimate ? 0.5 : 0,
              ease: "easeOut",
            }}
            className="text-lg font-bold tracking-wide text-center text-[#11d07a]"
          >
            Fast. Simple. No chasing. Ever again.
          </motion.p>
        </div>
      </div>
    </section>
  );
};
