"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

// Lazy load ValidationForm only when scrolled into view
const ValidationForm = dynamic(() => import("@/components/ValidationForm").then(mod => ({ default: mod.ValidationForm })), {
  ssr: false,
});

export function LazyValidationForm() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px", // Start loading 200px before visible
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full">
      {shouldLoad ? <ValidationForm /> : <div className="min-h-[600px]" />}
    </div>
  );
}

