"use client";

import React, { useEffect, useRef, useState } from "react";

interface PainSectionProps {
  className?: string;
}

export const PainSection = ({ className = "" }: PainSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="pain"
      ref={sectionRef}
      aria-labelledby="pain-heading"
      role="region"
      className={`relative w-full py-12 md:py-28 px-6 md:px-8 overflow-hidden bg-transparent ${className}`}
    >
      <div className="max-w-[980px] mx-auto flex flex-col items-center text-center z-10 relative">
        {/* Overline */}
        <span
          className={`text-white text-xs md:text-sm font-bold tracking-[0.15em] uppercase mb-4 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Stop Chasing Payments.
        </span>

        {/* Headline */}
        <h2
          id="pain-heading"
          className={`text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight md:leading-tight mb-8 md:mb-12 max-w-4xl drop-shadow-lg transition-all duration-700 delay-100 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-95"
          }`}
        >
          Clients delaying? Forgetting? "Will pay tomorrow"?
        </h2>

        {/* Body Copy */}
        <div className="flex flex-col gap-4 md:gap-2 max-w-[720px] text-base md:text-lg text-[#C9C9C9] leading-relaxed mb-10 md:mb-14">
          <p
            className={`transition-all duration-700 delay-200 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Freelancers lose time, money, and peace every time a client drags a payment.
          </p>
          <p
            className={`transition-all duration-700 delay-[280ms] ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Endless reminders. Back-and-forth messages. Confusing payment methods.
          </p>
          <p
            className={`transition-all duration-700 delay-[360ms] ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            It shouldn’t be this hard to get paid for work you’ve already delivered.
          </p>
        </div>

        {/* Closing Value Statement */}
        <p
          className={`text-base md:text-lg font-bold text-[#21D07A] tracking-wide transition-all duration-700 delay-500 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0 animate-pulse-once"
              : "opacity-0 translate-y-4"
          }`}
        >
          We make payments instant — so you never chase a client again.
        </p>
      </div>
    </section>
  );
};
