"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";

// Lazy load Particles component - heavy canvas animation
const Particles = dynamic(
  () =>
    import("@/components/ui/particles").then((mod) => ({
      default: mod.Particles,
    })),
  {
    ssr: false,
  }
);

export default function HeroBackground({
  active = true,
}: {
  active?: boolean;
}) {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  // Lazy-enable animations slightly after mount for perceived performance
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setEnabled(true), 300);
    return () => clearTimeout(t);
  }, [active]);

  // simple shared animation for blobs
  const blobMotion =
    reduce || !enabled
      ? { animate: { rotate: 0 } }
      : {
          animate: { rotate: [0, 3, -2, 0] },
          transition: {
            duration: 18,
            ease: "linear" as const,
            repeat: Infinity,
          },
        };

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      style={{ backgroundColor: "var(--bg-dark)" }}
    >
      {/* subtle vignette */}
      <div className="absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-black/90" />

      <svg
        viewBox="0 0 1440 720"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full opacity-100"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="g-green" cx="50%" cy="50%">
            <stop
              offset="0%"
              stopColor="var(--brand-primary-glow)"
              stopOpacity="0.25"
            />
            <stop
              offset="70%"
              stopColor="var(--brand-primary-glow)"
              stopOpacity="0.05"
            />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <filter id="blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="40" />
          </filter>
        </defs>

        {/* large ambient blob (soft green) */}
        <motion.g {...blobMotion} style={{ transformOrigin: "50% 50%" }}>
          <ellipse
            cx="740"
            cy="360"
            rx="520"
            ry="260"
            fill="url(#g-green)"
            filter="url(#blur)"
          />
        </motion.g>
      </svg>
      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color="#00E389"
        refresh
      />
    </div>
  );
}
