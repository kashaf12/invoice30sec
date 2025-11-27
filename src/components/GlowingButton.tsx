"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

interface GlowingButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export default function GlowingButton({ children, onClick, href, className = "" }: GlowingButtonProps) {
  const reduce = useReducedMotion();

  const glowAnimation = reduce ? {} : {
    initial: { opacity: 0.5, scale: 0.8 },
    animate: { 
      opacity: [0.5, 0.8, 0.5],
      scale: [1, 1.1, 1],
    },
    transition: { 
      duration: 3, 
      ease: "easeInOut" as const,
      repeat: Infinity,
      repeatType: "loop" as const
    }
  };

  const Component = href ? motion.a : motion.div;
  const props = href ? { href } : {};

  return (
    <Component
      {...props}
      onClick={onClick}
      className={`relative inline-block w-full sm:w-auto group ${className}`}
      aria-label={typeof children === 'string' ? children : 'Get early access'}
    >
      {/* Animated Glow Behind */}
      <motion.div
        className="absolute -inset-1 rounded-xl bg-[#00F09A] blur-xl opacity-40 z-0"
        {...glowAnimation}
      />

      {/* Static Glow Layer (always visible) */}
      <span 
        className="absolute -inset-[1px] rounded-xl blur-md opacity-60 z-0 transition-opacity duration-300 group-hover:opacity-80" 
        style={{ background: "linear-gradient(180deg,#00F09A,#00C87A)" }} 
      />

      {/* Main Button */}
      <button
        className="relative z-10 w-full px-6 py-3 rounded-xl text-black font-semibold shadow-md hover:scale-[1.02] active:scale-95 transition-transform duration-150"
        style={{
          background: "linear-gradient(180deg,#00F09A,#00C87A)"
        }}
      >
        {children}
      </button>

      {/* Hover Shadow */}
      <style jsx>{`
        button:hover {
          box-shadow: 0 14px 40px rgba(0,220,140,0.25), 0 2px 4px rgba(0,0,0,0.5) !important;
        }
      `}</style>
    </Component>
  );
}
