"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useActiveSection } from "@/hooks/useActiveSection";

// Placeholder tracking function
const track = (event: string, data?: Record<string, any>) => {
  if (typeof window !== "undefined" && (window as any).dataLayer) {
    (window as any).dataLayer.push({ event, ...data });
  }
  console.log("Analytics:", event, data);
};

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  // Track active section for nav highlighting
  const activeSection = useActiveSection(["hero", "pain", "howitworks", "why", "validation"]);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Scroll behavior for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
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
      const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;

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
  }, [isMobileMenuOpen]);

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
    track("mobile_menu_close");
    openButtonRef.current?.focus();
  };

  const handleCTAClick = (location: string) => {
    track("cta_click", { location });
  };

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#09d57a] focus:text-black focus:rounded-md focus:font-semibold"
      >
        Skip to content
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-50 ${
          prefersReducedMotion ? "" : "transition-all duration-300"
        } ${
          isScrolled
            ? "backdrop-blur-md bg-black/40 shadow-lg h-14 md:h-16"
            : "bg-transparent h-14 md:h-20"
        }`}
      >
        <div className="w-full max-w-[1100px] mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={`text-[18px] md:text-[24px] font-semibold text-white tracking-tight z-50 relative hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] ${
              prefersReducedMotion ? "" : "transition-all duration-200"
            }`}
            aria-label="Invoice30Sec Home"
          >
            Invoice30Sec
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <Link
              href="#howitworks"
              className={`text-sm uppercase tracking-widest hover:brightness-110 ${
                prefersReducedMotion ? "" : "transition-colors duration-200"
              } ${
                activeSection === "howitworks" ? "text-[#09d57a]" : "text-gray-300/80 hover:text-white"
              }`}
            >
              How It Works
            </Link>
            <Link
              href="#why"
              className={`text-sm uppercase tracking-widest hover:brightness-110 ${
                prefersReducedMotion ? "" : "transition-colors duration-200"
              } ${
                activeSection === "why" ? "text-[#09d57a]" : "text-gray-300/80 hover:text-white"
              }`}
            >
              Why
            </Link>
            <Button
              asChild
              className="bg-[#09d57a] hover:bg-[#09d57a]/90 text-black font-semibold rounded-xl shadow-md"
              data-analytics="header_cta"
              onClick={() => handleCTAClick("header")}
            >
              <Link href="#validation">Get Early Access</Link>
            </Button>
          </nav>

          {/* Mobile Hamburger */}
          <button
            ref={openButtonRef}
            className={`md:hidden text-white p-2 -mr-2 z-50 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#09d57a] rounded-md ${
              prefersReducedMotion ? "" : "transition-transform duration-200"
            } hover:scale-110`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Slide-over Menu Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-[55] ${
          prefersReducedMotion ? "" : "transition-opacity duration-300"
        } ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleCloseMobileMenu}
        aria-hidden="true"
      />

      {/* Mobile Slide-over Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 bottom-0 w-[80%] max-w-[300px] bg-[#0B0D0F] border-l border-white/10 shadow-2xl md:hidden flex flex-col pt-20 px-6 gap-6 z-[60] ${
          prefersReducedMotion ? "" : "transform transition-transform duration-300 ease-out"
        } ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <nav className="flex flex-col gap-6" aria-label="Mobile navigation">
          <Link
            href="#howitworks"
            className="text-white/90 hover:text-white text-[18px] font-medium border-b border-white/10 pb-4"
            onClick={handleCloseMobileMenu}
          >
            How It Works
          </Link>
          <Link
            href="#why"
            className="text-white/90 hover:text-white text-[18px] font-medium border-b border-white/10 pb-4"
            onClick={handleCloseMobileMenu}
          >
            Why
          </Link>
          <div className="flex flex-col gap-4 mt-4">
            <Button
              asChild
              className="w-full justify-center bg-[#09d57a] hover:bg-[#09d57a]/90 text-black font-semibold rounded-xl"
              data-analytics="header_cta_mobile"
              onClick={() => {
                handleCTAClick("header_mobile");
                handleCloseMobileMenu();
              }}
            >
              <Link href="#validation">Get Early Access</Link>
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
};
