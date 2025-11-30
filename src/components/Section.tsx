"use client";

import React from "react";
import { motion } from "framer-motion";

type SectionProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
};

export function Section({ id, children, className = "" }: SectionProps) {
  return (
    <section
      id={id}
      className={`min-h-screen snap-start flex items-center justify-center ${className}`}
      aria-labelledby={`${id}-title`}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full"
      >
        {children}
      </motion.div>
    </section>
  );
}
