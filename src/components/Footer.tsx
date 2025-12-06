"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Linkedin, Twitter, Github, Send, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Placeholder tracking function
interface DataLayer {
  push: (data: { event: string; [key: string]: unknown }) => void;
}

const track = (event: string, data?: Record<string, unknown>) => {
  if (
    typeof window !== "undefined" &&
    (window as unknown as { dataLayer?: DataLayer }).dataLayer !== undefined
  ) {
    (window as unknown as { dataLayer?: DataLayer }).dataLayer?.push({
      event,
      ...data,
    } as { event: string; [key: string]: unknown });
  }
  // eslint-disable-next-line no-console
  console.log("Analytics:", event, data);
};

interface FooterSubscribeProps {
  onSuccess?: () => void;
}

export const FooterSubscribe = ({ onSuccess }: FooterSubscribeProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Subscription failed");
      }

      setMessage({ type: "success", text: "Thanks for subscribing!" });
      setEmail("");
      track("footer_subscribe", { email });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <label htmlFor="footer-email" className="sr-only">
          Email address
        </label>
        <Input
          id="footer-email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-white placeholder:text-gray-500 flex-1 min-h-[44px]"
          style={{
            backgroundColor: "var(--bg-dark)",
            borderColor: "var(--border-white-10)",
          }}
          aria-describedby="footer-email-help"
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          className="text-black font-semibold rounded-xl whitespace-nowrap flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
          style={{ backgroundColor: "var(--brand-primary)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
          data-analytics="footer_subscribe"
          disabled={isSubmitting}
        >
          <Send className="w-4 h-4" aria-hidden="true" />
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </Button>
      </div>

      <p id="footer-email-help" className="text-xs text-gray-400">
        Product updates only. Unsubscribe anytime.
      </p>

      {message && (
        <p
          role="alert"
          className={`text-sm ${
            message.type === "success" ? "" : "text-red-400"
          }`}
          style={
            message.type === "success" ? { color: "var(--brand-primary)" } : {}
          }
        >
          {message.text}
        </p>
      )}
    </form>
  );
};

export const Footer = () => {
  const pathname = usePathname();

  const handleSocialClick = (platform: string) => {
    track("social_click", { platform });
  };

  const handleCTAClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    track("footer_cta_click");

    // Check if we're on the home page
    if (pathname === "/") {
      // If on home page, prevent navigation and just scroll to validation section
      e.preventDefault();
      document
        .getElementById("validation")
        ?.scrollIntoView({ behavior: "smooth" });
    }
    // If on another page, let Link handle navigation to /#validation
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-transparent border-t border-gray-800 pt-12 md:pt-16 pb-[max(2rem,env(safe-area-inset-bottom))] md:pb-[max(3rem,env(safe-area-inset-bottom))] relative z-50">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Top CTA Line */}
        <div className="text-center mb-8 md:mb-12">
          <Link
            href="/#validation"
            onClick={handleCTAClick}
            className="inline-flex items-center gap-2 font-semibold text-lg transition-all duration-300"
            style={{ color: "var(--brand-primary)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--brand-primary-hover)";
              e.currentTarget.style.filter =
                "drop-shadow(0 0 8px var(--brand-primary-40))";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--brand-primary)";
              e.currentTarget.style.filter = "none";
            }}
            data-analytics="footer_cta"
          >
            Get Early Access
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* Product Column */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#how"
                  className="text-secondary-foreground transition-colors text-sm hover:text-primary"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="#why"
                  className="text-secondary-foreground transition-colors text-sm hover:text-primary"
                >
                  Why This Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@invoice30sec.com"
                  className="text-secondary-foreground transition-colors text-sm hover:text-primary"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Updates
            </h3>
            <FooterSubscribe />
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 md:gap-6 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-gray-800">
          <a
            href="https://www.linkedin.com/in/kashaf-ahmed/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleSocialClick("linkedin")}
            className="text-secondary-foreground transition-colors hover:text-primary"
            data-analytics="social_click"
            data-social="linkedin"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-6 h-6" aria-hidden="true" />
            <span className="sr-only">LinkedIn</span>
          </a>

          <a
            href="https://x.com/kashafaahmed"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleSocialClick("twitter")}
            className="text-secondary-foreground transition-colors hover:text-primary"
            data-analytics="social_click"
            data-social="twitter"
            aria-label="Twitter"
          >
            <Twitter className="w-6 h-6" aria-hidden="true" />
            <span className="sr-only">Twitter</span>
          </a>

          <a
            href="https://github.com/kashaf12"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleSocialClick("github")}
            className="text-secondary-foreground transition-colors hover:text-primary"
            data-analytics="social_click"
            data-social="github"
            aria-label="GitHub"
          >
            <Github className="w-6 h-6" aria-hidden="true" />
            <span className="sr-only">GitHub</span>
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-400">
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 md:gap-4 items-center">
            <p>© {currentYear} Invoice30Sec. All rights reserved.</p>
            <span className="hidden sm:inline">•</span>
            <p className="text-xs italic">Built for freelancers</p>
          </div>
          <div className="flex gap-4 md:gap-6">
            <Link
              href="/privacy"
              prefetch={true}
              className="text-secondary-foreground transition-colors hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              prefetch={true}
              className="text-secondary-foreground transition-colors hover:text-primary"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
