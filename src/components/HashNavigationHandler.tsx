"use client";

import { useEffect, useRef } from "react";

/**
 * HashNavigationHandler - Scrolls to hash target on page load
 * This handles navigation from other pages with hash (e.g., /privacy -> /#validation)
 */
export function HashNavigationHandler() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if there's a hash in the URL
    const hash = window.location.hash;

    if (hash) {
      // Small delay to ensure DOM is fully loaded
      timeoutRef.current = setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        timeoutRef.current = null;
      }, 100);
    }

    // Cleanup: clear timeout if component unmounts before timeout fires
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return null; // This component doesn't render anything
}
