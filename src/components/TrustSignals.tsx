"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CreditCard, Building2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TrustSignalsProps {
  signupCount?: number;
}

const avatars = [
  {
    src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    alt: "Early adopter Alex",
    name: "Alex",
  },
  {
    src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    alt: "Early adopter Sarah",
    name: "Sarah",
  },
  {
    src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
    alt: "Early adopter Jordan",
    name: "Jordan",
  },
];

const paymentBadges = [
  {
    name: "Stripe",
    src: "/stripe.svg",
    type: "image" as const,
  },
  {
    name: "UPI",
    src: "/upi.svg",
    type: "image" as const,
  },
  {
    name: "Razorpay",
    src: "/razorpay.svg",
    type: "image" as const,
  },
  {
    name: "PayPal",
    src: "/paypal.svg",
    type: "image" as const,
  },
  {
    name: "Credit Card",
    icon: CreditCard,
    type: "icon" as const,
  },
  {
    name: "Bank Transfer",
    icon: Building2,
    type: "icon" as const,
  },
];

export const TrustSignals = ({ signupCount = 100 }: TrustSignalsProps) => {
  return (
    <div className="w-full mt-5 md:mt-8">
      {/* Trust Row Container - Beta Pill + Avatars */}
      <div
        className="w-full flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 px-4 py-3 rounded-lg border"
        style={{
          borderColor: "var(--border-white-10)",
          backgroundColor: "var(--bg-dark-card)",
        }}
      >
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
          {/* Beta Pill */}
          <span className="text-xs uppercase tracking-widest text-white/80 px-3 py-1 border border-white/6 rounded-full whitespace-nowrap">
            Beta — limited early access
          </span>

          {/* Avatars + Text */}
          <div className="flex items-center gap-2 flex-1 justify-center md:justify-start">
            <div className="flex -space-x-2">
              {avatars.map((avatar, index) => (
                <motion.img
                  key={index}
                  src={avatar.src}
                  alt={avatar.alt}
                  title={`${avatar.name} joined`}
                  className="w-7 h-7 rounded-full ring-2 ring-transparent hover:ring-[#11d07a]/30 transition-all duration-200 cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  tabIndex={0}
                />
              ))}
            </div>
            <span className="text-sm text-white/80 whitespace-nowrap">
              Join {signupCount}+ early signups
            </span>
          </div>
        </div>
      </div>

      {/* Payment Badges - Separate Line */}
      <TooltipProvider>
        <div className="mx-auto flex items-center gap-4 opacity-90 justify-center mt-3 flex-wrap">
          {paymentBadges.map((badge, index) => {
            const IconComponent = badge.type === "icon" ? badge.icon : null;
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center group cursor-pointer transition-all duration-200 hover:scale-105">
                    <span className="sr-only">{badge.name}</span>
                    {badge.type === "image" ? (
                      <Image
                        src={badge.src}
                        alt={badge.name}
                        className="h-6 w-auto opacity-80 group-hover:opacity-100 transition-opacity duration-200"
                        aria-label={badge.name}
                        tabIndex={0}
                        unoptimized
                        width={24}
                        height={24}
                      />
                    ) : (
                      IconComponent && (
                        <IconComponent
                          className="w-6 h-6 text-white/80 group-hover:text-[#11d07a] transition-colors duration-200"
                          aria-label={badge.name}
                          aria-hidden="true"
                          strokeWidth={1.5}
                        />
                      )
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{badge.name}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>

      {/* Security Text */}
      <p className="mt-2 text-center text-[13px] md:text-sm text-white/60 max-w-[680px] mx-auto">
        We&apos;ll only email you about early access and product updates.
        Payments processed securely.
      </p>
    </div>
  );
};
