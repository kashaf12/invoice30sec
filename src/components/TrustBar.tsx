"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

interface TrustBarProps {
  signupCount?: number;
}

export const TrustBar = ({ signupCount = 100 }: TrustBarProps) => {
  // Avatar images for social proof
  const avatars = [
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      alt: "Early adopter Alex",
    },
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      alt: "Early adopter Sarah",
    },
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
      alt: "Early adopter Jordan",
    },
  ];

  return (
    <div
      className="w-full flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 px-4 py-3 rounded-lg border"
      style={{
        borderColor: "var(--border-white-10)",
        backgroundColor: "var(--bg-dark-card)",
      }}
    >
      {/* Center: Beta badge */}
      <Badge
        variant="outline"
        className="text-xs px-3 py-1 rounded-full border"
        style={{
          borderColor: "var(--border-white-20)",
          color: "var(--text-secondary)",
        }}
      >
        Beta — limited early access
      </Badge>

      {/* Right: Social proof with avatars */}
      <div className="flex items-center gap-3">
        {/* Overlapped avatars */}
        <div className="flex -space-x-2">
          {avatars.map((avatar, index) => (
            <Avatar
              key={index}
              className="size-8 border-2 rounded-full"
              src={avatar.src}
              alt={avatar.alt}
              style={{
                borderColor: "var(--bg-dark)",
              }}
              data-slot="avatar"
            />
          ))}
        </div>

        {/* Signup count */}
        <span
          role="status"
          aria-live="polite"
          className="text-xs md:text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Join {signupCount}+ early signups
        </span>
      </div>
    </div>
  );
};
