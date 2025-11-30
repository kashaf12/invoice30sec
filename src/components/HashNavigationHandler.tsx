"use client";

import { useEffect } from "react";

/**
 * HashNavigationHandler - Scrolls to hash target on page load
 * This handles navigation from other pages with hash (e.g., /privacy -> /#validation)
 */
export function HashNavigationHandler() {
  useEffect(() => {
    // Check if there's a hash in the URL
    const hash = window.location.hash;
    
    if (hash) {
      // Small delay to ensure DOM is fully loaded
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, []);

  return null; // This component doesn't render anything
}
