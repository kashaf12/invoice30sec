"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface HowItWorksProps {
  className?: string;
}

const STEPS = [
  {
    title: "1. Create your invoice in 30 seconds.",
    body: [
      "Add amount, a short description, and the due date — that's it.",
      "No templates. No setup. No friction.",
    ],
  },
  {
    title: "2. Add how you want to get paid.",
    body: [
      "UPI, Stripe, Razorpay, PayPal, or direct bank transfer.",
      "Your client sees all available options — they pick the fastest one.",
    ],
  },
  {
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
  const sectionRef = useRef<HTMLElement>(null);

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

  return (
    <section
      id="how"
      ref={sectionRef}
      aria-labelledby="how-heading"
      role="region"
      className={`relative w-full py-12 md:py-28 px-6 md:px-8 overflow-hidden bg-transparent ${className}`}
    >
      <div className="max-w-[1100px] mx-auto flex flex-col items-center z-10 relative">
        {/* Overline */}
        <span
          className={`text-white text-xs md:text-sm font-bold tracking-[0.15em] uppercase mb-4 text-center transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          How It Works
        </span>

        {/* Headline */}
        <h2
          id="how-heading"
          className={`text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight md:leading-tight text-center mb-16 md:mb-24 max-w-4xl transition-all duration-700 delay-100 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-95"
          }`}
        >
          Instant payments in 3 steps — no chasing, ever again.
        </h2>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16">
          {STEPS.map((step, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className={`transition-all duration-700 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <Card className="h-full bg-[#131619] border-white/5 hover:border-[#00E389]/20 transition-colors">
                <CardContent className="p-6 md:p-8 flex flex-col items-center md:items-start text-center md:text-left h-full">
                  {/* Step Heading */}
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                    {step.title}
                  </h3>

                  {/* Step Body */}
                  <div className="flex flex-col gap-4 text-base text-[#C9C9C9] leading-relaxed">
                    {step.body.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tagline */}
        <p
          className={`text-lg font-bold text-[#21D07A] tracking-wide text-center transition-all duration-700 delay-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Fast. Simple. No chasing. Ever again.
        </p>
      </div>
    </section>
  );
};
