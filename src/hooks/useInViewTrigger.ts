"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewTriggerOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseInViewTriggerReturn {
  inView: boolean;
  triggered: boolean;
  ref: React.RefObject<HTMLElement | null>;
}

/**
 * Hook that uses IntersectionObserver to trigger animations once when element enters viewport.
 * Returns both current inView state and a triggered flag that becomes true once the element has been seen.
 */
export function useInViewTrigger(
  options: UseInViewTriggerOptions = {}
): UseInViewTriggerReturn {
  const { threshold = 0.25, rootMargin = "0px", triggerOnce = true } = options;

  const [inView, setInView] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isIntersecting = entry.isIntersecting;
          setInView(isIntersecting);

          if (isIntersecting && !triggered) {
            setTriggered(true);
            if (triggerOnce) {
              // Disconnect after first trigger if triggerOnce is true
              observer.disconnect();
            }
          } else if (!isIntersecting && !triggerOnce) {
            // Reset triggered state if triggerOnce is false and element leaves viewport
            setTriggered(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, triggered]);

  return { inView, triggered, ref };
}
