"use client";

import React from "react";
import { motion, useReducedMotion, Variants } from "motion/react";
import { useInViewTrigger } from "@/hooks/useInViewTrigger";

type SectionProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
  triggerOnce?: boolean;
  variant?: "fadeUp" | "fadeIn";
};

// Animation variants for section children
const childVariants: Record<"fadeUp" | "fadeIn", Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  },
};

// Parent variant for staggering children
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.06,
    },
  },
};

export function Section({
  id,
  children,
  className = "",
  triggerOnce = true,
  variant = "fadeUp",
}: SectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const { triggered, ref } = useInViewTrigger({
    threshold: 0.25,
    rootMargin: "0px",
    triggerOnce,
  });

  // If reduced motion is preferred, render statically
  if (prefersReducedMotion) {
    return (
      <section
        id={id}
        className={`min-h-screen snap-start flex items-center justify-center pt-20 pb-20 md:pt-28 md:pb-28 xl:pt-32 xl:pb-32 ${className}`}
        aria-labelledby={`${id}-title`}
      >
        <div className="w-full">{children}</div>
      </section>
    );
  }

  const childVariant = childVariants[variant];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id={id}
      className={`min-h-screen snap-start flex items-center justify-center pt-20 pb-20 md:pt-28 md:pb-28 xl:pt-32 xl:pb-32 ${className}`}
      aria-labelledby={`${id}-title`}
    >
      <motion.div
        className="w-full"
        variants={containerVariants}
        initial="hidden"
        animate={triggered ? "visible" : "hidden"}
        exit="hidden"
      >
        {React.Children.map(children, (child, index) => {
          // Only wrap direct children that are valid React elements
          if (React.isValidElement(child)) {
            // Limit staggering to first 12 children for performance
            if (index < 12) {
              // Wrap in motion.div to inherit stagger animation
              return (
                <motion.div
                  key={index}
                  variants={childVariant}
                  className="w-full"
                >
                  {child}
                </motion.div>
              );
            }
            // For children beyond 12, render without animation wrapper
            return (
              <div key={index} className="w-full">
                {child}
              </div>
            );
          }
          return child;
        })}
      </motion.div>
    </section>
  );
}
