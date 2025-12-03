import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Shield, Zap } from "lucide-react";

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
    name: "PayPal",
    src: "/paypal.svg",
    type: "image" as const,
  },
  {
    name: "Google Pay",
    src: "/google-pay.svg",
    type: "image" as const,
  },
  {
    name: "Visa",
    src: "/visa-pay.svg",
    type: "image" as const,
  },
  {
    name: "Bitcoin",
    src: "/bitcoin-pay.svg",
    type: "image" as const,
  },
];

export const TrustSignals = ({ signupCount = 100 }: TrustSignalsProps) => {
  return (
    <div className="w-full mt-5 md:mt-8">
      {/* Trust Row Container - Beta Pill + Avatars */}
      <div
        className="w-full flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 lg:gap-6 px-3 md:px-4 py-3 rounded-lg border"
        style={{
          borderColor: "var(--border-white-10)",
          backgroundColor: "var(--bg-dark-card)",
        }}
      >
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4 w-full">
          {/* Beta Pill */}
          <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/80 px-2 md:px-3 py-1 border border-white/6 rounded-full whitespace-nowrap">
            Beta — limited early access
          </span>

          {/* Avatars + Text */}
          <div className="flex items-center gap-2 flex-1 justify-center md:justify-start w-full md:w-auto">
            <div className="flex -space-x-2">
              {avatars.map((avatar, index) => (
                <Image
                  key={index}
                  src={avatar.src}
                  alt={avatar.alt}
                  title={`${avatar.name} joined`}
                  className="w-6 h-6 md:w-7 md:h-7 rounded-full ring-2 ring-transparent hover:ring-primary/30 transition-all duration-200 cursor-pointer hover:scale-110"
                  width={28}
                  height={28}
                  sizes="(max-width: 768px) 24px, 28px"
                  tabIndex={0}
                />
              ))}
            </div>
            <span className="text-xs md:text-sm text-white/80 whitespace-nowrap">
              Join {signupCount}+ early signups
            </span>
          </div>
        </div>
      </div>

      {/* Trust Anchors - Security & Speed */}
      <div className="flex items-center justify-center gap-2 md:gap-4 mt-3 md:mt-4 flex-wrap">
        <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-white/5 border border-white/10">
          <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
          <span className="text-[10px] md:text-xs text-white/80">
            256-bit encrypted
          </span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-white/5 border border-white/10">
          <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
          <span className="text-[10px] md:text-xs text-white/80">
            30-second setup
          </span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-white/5 border border-white/10">
          <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
          <span className="text-[10px] md:text-xs text-white/80">
            Instant payments
          </span>
        </div>
      </div>

      {/* Payment Badges - Separate Line */}
      <div
        className="mx-auto w-full md:max-w-none mt-3 rounded-xl px-4 py-2"
        style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
      >
        <TooltipProvider>
          <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
            {paymentBadges.map((badge, index) => {
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center group cursor-pointer transition-all duration-200 shrink-0">
                      <span className="sr-only">{badge.name}</span>
                      <Image
                        src={badge.src}
                        alt={badge.name}
                        className="opacity-85 group-hover:opacity-100 grayscale brightness-[1.2] group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-200 object-contain w-auto"
                        style={{ height: "22px" }}
                        aria-label={`Pay with ${badge.name}`}
                        role="img"
                        tabIndex={0}
                        width={100}
                        height={22}
                        sizes="100px"
                      />
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
      </div>
    </div>
  );
};
