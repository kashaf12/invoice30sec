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

// Function to highlight key benefit words in green
const highlightKeyWords = (text: string) => {
  const keyWords = [
    "instantly",
    "fastest",
    "seconds",
    "automated",
    "taps once",
    "no delays",
    "no confusion",
    "no excuses",
    "no reminders",
  ];

  // Sort by length (longest first) to avoid partial matches
  const sortedWords = keyWords.sort((a, b) => b.length - a.length);

  let highlightedText = text;

  sortedWords.forEach((word) => {
    // Escape special regex characters
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escapedWord}\\b`, "gi");

    highlightedText = highlightedText.replace(
      regex,
      (match) => `<span class="text-primary font-semibold">${match}</span>`
    );
  });

  return highlightedText;
};

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
      className={`relative w-full py-20 md:py-28 xl:py-32 overflow-hidden bg-transparent ${className}`}
    >
      {/* Radial glow behind heading */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center z-10 relative">
          {/* Overline */}
          <motion.span
            initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
            animate={shouldAnimate && isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-3 md:mb-4 text-center"
          >
            WHY FREELANCERS LOVE THIS.
          </motion.span>

          {/* Headline */}
          <motion.h2
            id="why-heading"
            initial={shouldAnimate ? { opacity: 0, y: 30 } : false}
            animate={shouldAnimate && isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-foreground text-center mb-6 md:mb-10 max-w-[90%] md:max-w-4xl leading-tight relative"
          >
            Get paid <span className="text-primary">instantly</span> — without
            awkward conversations ever again.
          </motion.h2>

          {/* Cards Grid */}
          <div className="grid gap-6 md:gap-8 lg:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full mb-6 md:mb-12">
            {cards.map((card, index) => (
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
                  aria-label={`Benefit: ${card.title}`}
                  className="h-full bg-card border border-white/5 rounded-xl hover:border-primary/20 hover:shadow-[0_0_20px_rgba(17,208,122,0.1)] transition-all duration-300 group"
                >
                  <CardContent className="p-6 md:p-8 flex flex-col h-full">
                    {/* Icon - Monochrome, above title */}
                    <div className="mb-6 flex justify-center">
                      <card.icon
                        className="w-8 h-8 text-foreground/60 group-hover:text-foreground/80 transition-colors duration-300"
                        aria-hidden="true"
                      />
                    </div>

                    {/* Card Title */}
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-3 md:mb-4 text-center">
                      {card.title}
                    </h3>

                    {/* Card Body with highlighted keywords */}
                    <p
                      className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3 md:mb-4 grow"
                      dangerouslySetInnerHTML={{
                        __html: highlightKeyWords(card.body),
                      }}
                    />

                    {/* Micro Emphasis */}
                    <p className="text-xs md:text-sm font-bold text-primary mt-auto text-center">
                      {card.micro}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Micro-CTA */}
          <motion.a
            href="#validation"
            onClick={handleCTAClick}
            initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
            animate={shouldAnimate && isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.6,
              delay: shouldAnimate ? 0.5 : 0,
              ease: "easeOut",
            }}
            className="text-base font-medium text-primary text-center hover:text-primary/90 transition-all duration-300 ease-out"
          >
            Join the waitlist and never chase payments again →
          </motion.a>
        </div>
      </div>
    </section>
  );
};
