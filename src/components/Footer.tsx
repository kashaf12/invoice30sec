"use client";

import React, { useState } from "react";
import Link from "next/link";
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
          className="text-white placeholder:text-gray-500 flex-1"
          style={{
            backgroundColor: "var(--bg-dark)",
            borderColor: "var(--border-white-10)",
          }}
          aria-describedby="footer-email-help"
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          className="text-black font-semibold rounded-xl whitespace-nowrap flex items-center gap-2"
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

      <p id="footer-email-help" className="text-xs text-gray-500">
        We&apos;ll only send product updates. Unsubscribe anytime.
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
  const handleSocialClick = (platform: string) => {
    track("social_click", { platform });
  };

  const handleCTAClick = () => {
    track("footer_cta_click");
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-transparent border-t border-gray-800 pt-12 pb-8 px-6 snap-start relative z-50">
      <div className="max-w-6xl mx-auto">
        {/* Top CTA Line */}
        <div className="text-center mb-12">
          <Link
            href="#validation"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Product Column */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#how"
                  className="hover:text-white transition-colors text-sm"
                  style={{ color: "var(--text-secondary-alt)" }}
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="#why"
                  className="hover:text-white transition-colors text-sm"
                  style={{ color: "var(--text-secondary-alt)" }}
                >
                  Why Freelancers Love This
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
                  href="mailto:kashafaahmed@gmail.com"
                  className="hover:text-white transition-colors text-sm"
                  style={{ color: "var(--text-secondary-alt)" }}
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Stay Updated
            </h3>
            <FooterSubscribe />
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 mb-8 pb-8 border-b border-gray-800">
          <a
            href="https://www.linkedin.com/in/kashaf-ahmed/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleSocialClick("linkedin")}
            className="hover:text-white transition-colors"
            style={{ color: "var(--text-secondary-alt)" }}
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
            className="hover:text-white transition-colors"
            style={{ color: "var(--text-secondary-alt)" }}
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
            className="hover:text-white transition-colors"
            style={{ color: "var(--text-secondary-alt)" }}
            data-analytics="social_click"
            data-social="github"
            aria-label="GitHub"
          >
            <Github className="w-6 h-6" aria-hidden="true" />
            <span className="sr-only">GitHub</span>
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 items-center">
            <p>© {currentYear} Invoice30Sec. All rights reserved.</p>
            <span className="hidden sm:inline">•</span>
            <p className="text-xs italic">
              Built by a freelancer, for freelancers
            </p>
          </div>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
