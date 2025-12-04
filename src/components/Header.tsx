"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, PlayCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useActiveSection } from "@/hooks/useActiveSection";

// Placeholder tracking function
interface DataLayer {
  push: (data: { event: string; [key: string]: unknown }) => void;
}

declare global {
  interface Window {
    dataLayer?: DataLayer;
  }
}

const track = (event: string, data?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({ event, ...data });
  }
  // Analytics tracking - only log in development
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log("Analytics:", event, data);
  }
};

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  // Check for reduced motion preference using useSyncExternalStore
  const prefersReducedMotion = useSyncExternalStore(
    (callback) => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      mediaQuery.addEventListener("change", callback);
      return () => mediaQuery.removeEventListener("change", callback);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false // Server snapshot
  );

  // Track active section for nav highlighting
  const activeSection = useActiveSection([
    "hero",
    "pain",
    "howitworks",
    "why",
    "validation",
  ]);

  const handleCloseMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    track("mobile_menu_close");
    openButtonRef.current?.focus();
  }, []);

  // Scroll behavior for sticky header - shrink & blur at 48px
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 48);
    };
    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus trap and body scroll lock for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Track mobile menu open
      track("mobile_menu_open");

      const focusableElements = mobileMenuRef.current?.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
      );
      const firstElement = focusableElements?.[0] as HTMLElement;
      const lastElement = focusableElements?.[
        focusableElements.length - 1
      ] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
        if (e.key === "Escape") {
          handleCloseMobileMenu();
        }
      };

      document.addEventListener("keydown", handleTabKey);
      firstElement?.focus();

      // Prevent scrolling when menu is open
      document.body.classList.add("overflow-hidden");

      return () => {
        document.removeEventListener("keydown", handleTabKey);
        document.body.classList.remove("overflow-hidden");
      };
    }
  }, [isMobileMenuOpen, handleCloseMobileMenu]);

  const handleCTAClick = (location: string) => {
    track("cta_click", { location });
  };

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:text-black focus:rounded-md focus:font-semibold"
        style={{ backgroundColor: "var(--brand-primary)" }}
      >
        Skip to content
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top)] ${
          prefersReducedMotion ? "" : "transition-all duration-180 ease-out"
        } ${
          isScrolled
            ? "backdrop-blur-md bg-black/40 shadow-lg"
            : "bg-transparent"
        }`}
        style={{
          height: isScrolled ? "56px" : "72px",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={`flex items-center gap-2 text-[18px] md:text-[24px] font-semibold text-white tracking-tight z-50 relative hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] ${
              prefersReducedMotion ? "" : "transition-all duration-200"
            }`}
            aria-label="Invoice30Sec Home"
          >
            <Image
              src="/logo.svg"
              alt="Invoice30Sec Logo"
              width={24}
              height={24}
              className="w-5 h-5 md:w-6 md:h-6"
              priority
              sizes="(max-width: 768px) 20px, 24px"
            />
            <span>Invoice30Sec</span>
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Main navigation"
          >
            <Link
              href="#howitworks"
              className={`flex items-center gap-2 text-sm uppercase tracking-widest hover:brightness-110 ${
                prefersReducedMotion ? "" : "transition-colors duration-200"
              } ${
                activeSection === "howitworks"
                  ? ""
                  : "text-gray-300/80 hover:text-white"
              }`}
              style={
                activeSection === "howitworks"
                  ? { color: "var(--brand-primary)" }
                  : {}
              }
            >
              <PlayCircle
                className="w-4 h-4"
                aria-hidden="true"
                style={
                  activeSection === "howitworks"
                    ? { color: "var(--brand-primary)" }
                    : {}
                }
              />
              How It Works
            </Link>
            <Link
              href="#why"
              className={`flex items-center gap-2 text-sm uppercase tracking-widest hover:brightness-110 ${
                prefersReducedMotion ? "" : "transition-colors duration-200"
              } ${
                activeSection === "why"
                  ? ""
                  : "text-gray-300/80 hover:text-white"
              }`}
              style={
                activeSection === "why" ? { color: "var(--brand-primary)" } : {}
              }
            >
              <Sparkles
                className="w-4 h-4"
                aria-hidden="true"
                style={
                  activeSection === "why"
                    ? { color: "var(--brand-primary)" }
                    : {}
                }
              />
              Why
            </Link>
            <Button
              asChild
              className="text-black font-semibold rounded-xl shadow-md flex items-center gap-2"
              style={{ backgroundColor: "var(--brand-primary)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
              data-analytics="header_cta"
              onClick={() => handleCTAClick("header")}
            >
              <Link href="#validation" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                Get Early Access
              </Link>
            </Button>
          </nav>

          {/* Mobile Hamburger */}
          <button
            ref={openButtonRef}
            className={`md:hidden text-white p-2 -mr-2 z-50 relative focus-visible:outline-none focus-visible:ring-2 rounded-md ${
              prefersReducedMotion ? "" : "transition-transform duration-200"
            } hover:scale-110`}
            style={
              {
                "--tw-ring-color": "var(--brand-primary)",
              } as React.CSSProperties
            }
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Slide-over Menu Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-55 ${
          prefersReducedMotion ? "" : "transition-opacity duration-300"
        } ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={handleCloseMobileMenu}
        aria-hidden="true"
      />

      {/* Mobile Slide-over Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 bottom-0 w-[80%] max-w-[300px] border-l shadow-2xl md:hidden flex flex-col pt-20 px-6 gap-6 z-60 ${
          prefersReducedMotion
            ? ""
            : "transform transition-transform duration-300 ease-out"
        } ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{
          backgroundColor: "var(--bg-dark)",
          borderColor: "var(--border-white-10)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <nav className="flex flex-col gap-6" aria-label="Mobile navigation">
          <Link
            href="#howitworks"
            className="flex items-center gap-3 text-white/90 hover:text-white text-[18px] font-medium border-b border-white/10 pb-4"
            onClick={handleCloseMobileMenu}
          >
            <PlayCircle className="w-5 h-5" aria-hidden="true" />
            How It Works
          </Link>
          <Link
            href="#why"
            className="flex items-center gap-3 text-white/90 hover:text-white text-[18px] font-medium border-b border-white/10 pb-4"
            onClick={handleCloseMobileMenu}
          >
            <Sparkles className="w-5 h-5" aria-hidden="true" />
            Why
          </Link>
          <div className="flex flex-col gap-4 mt-4">
            <Button
              asChild
              className="w-full justify-center text-black font-semibold rounded-xl flex items-center gap-2"
              style={{ backgroundColor: "var(--brand-primary)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
              data-analytics="header_cta_mobile"
              onClick={() => {
                handleCTAClick("header_mobile");
                handleCloseMobileMenu();
              }}
            >
              <Link href="#validation" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                Get Early Access
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
};
