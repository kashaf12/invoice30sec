"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const particleData = [
  { cx: 80, cy: 120, r: 3, delay: 0 },
  { cx: 200, cy: 30, r: 4, delay: 0.4 },
  { cx: 400, cy: 90, r: 2.5, delay: 1 },
  { cx: 620, cy: 40, r: 3.5, delay: 1.6 },
  { cx: 920, cy: 180, r: 2.3, delay: 0.9 },
  { cx: 1200, cy: 80, r: 3.7, delay: 1.2 },
  { cx: 1400, cy: 120, r: 2.8, delay: 0.6 },
];

export default function HeroBackground({ active = true }: { active?: boolean }) {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  // Lazy-enable animations slightly after mount for perceived performance
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setEnabled(true), 300);
    return () => clearTimeout(t);
  }, [active]);

  // simple shared animation for blobs
  const blobMotion = reduce || !enabled
    ? { animate: { rotate: 0 } }
    : {
        animate: { rotate: [0, 3, -2, 0] },
        transition: { duration: 18, ease: "linear" as const, repeat: Infinity }
      };

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#0B0D0F]">
      {/* subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />

      <svg
        viewBox="0 0 1440 720"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full opacity-100"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="g-green" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#00E389" stopOpacity="0.25" />
            <stop offset="70%" stopColor="#00E389" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <filter id="blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="40" />
          </filter>
        </defs>

        {/* large ambient blob (soft green) */}
        <motion.g
          {...blobMotion}
          style={{ transformOrigin: "50% 50%" }}
        >
          <ellipse cx="740" cy="360" rx="520" ry="260" fill="url(#g-green)" filter="url(#blur)" />
        </motion.g>

        {/* angled diamond shape for depth */}
        <motion.rect
          x="150"
          y="80"
          width="1100"
          height="400"
          rx="18"
          transform="rotate(40 700 280)"
          fill="#00E389"
          opacity="0.05"
          {...(reduce || !enabled ? {} : { animate: { opacity: [0.05, 0.08, 0.05] }, transition: { duration: 8, repeat: Infinity } })}
        />

        {/* particles group — subtle floating dots */}
        <g>
          {particleData.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              fill="#00E389"
              opacity={0.3}
              initial={{ y: 0, opacity: 0.2 }}
              animate={reduce || !enabled ? {} : { y: [0, -15, 8, 0], opacity: [0.2, 0.5, 0.3, 0.2] }}
              transition={{ duration: 6 + i, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
