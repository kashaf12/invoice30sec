"use client";

import React, { useState } from "react";
import Link from "next/link";
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
          className="text-black font-semibold rounded-xl whitespace-nowrap"
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
            className="inline-block font-semibold text-lg transition-all duration-300"
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
            Get Early Access →
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
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
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
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
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
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
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
