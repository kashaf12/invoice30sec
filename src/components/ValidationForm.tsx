"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { CheckCircle2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CardContent } from "@/components/ui/card";
import { MagicCard } from "@/components/ui/magic-card";

const formSchema = z
  .object({
    email: z.email("Invalid email address"),
    willingToPay: z.enum(["yes", "maybe", "no"], {
      message: "Please select an option",
    }),
    price: z.number().optional(),
    priceIsOther: z.boolean().optional(),
    reason: z.string().optional(),
    reasonIsOther: z.boolean().optional(),
    honeypot: z.string().optional(),
  })
  .refine(
    (data) => {
      // If "maybe" selected, price must be provided
      if (data.willingToPay === "maybe" && !data.price) {
        return false;
      }
      return true;
    },
    {
      message: "Please select a price option",
      path: ["price"],
    }
  )
  .refine(
    (data) => {
      // If "no" selected, reason must be provided
      if (data.willingToPay === "no" && !data.reason) {
        return false;
      }
      return true;
    },
    {
      message: "Please select a reason",
      path: ["reason"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

const PRICE_OPTIONS = ["199", "149", "299", "Other"] as const;
const REASON_OPTIONS = [
  "Too expensive",
  "I don't need it",
  "Prefer free",
  "Payment concerns",
  "Other",
] as const;

export const ValidationForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      willingToPay: undefined,
      price: undefined,
      priceIsOther: false,
      reason: undefined,
      reasonIsOther: false,
      honeypot: "",
    },
  });

  const willingToPay = form.watch("willingToPay");
  const price = form.watch("price");
  const priceIsOther = form.watch("priceIsOther");
  const reason = form.watch("reason");
  const reasonIsOther = form.watch("reasonIsOther");

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

  // Track form_open event
  useEffect(() => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({ event: "form_open" });
    }
  }, []);

  // Track price selection
  useEffect(() => {
    if (price && typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "price_choice_selected",
        price: price,
      });
    }
  }, [price]);

  // Track reason selection
  useEffect(() => {
    if (reason && typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "no_followup_reason_selected",
        reason: reason,
      });
    }
  }, [reason]);

  async function onSubmit(data: FormValues) {
    if (data.honeypot) return; // Silently ignore spam

    try {
      // Build payload conditionally based on willingToPay
      const payload: {
        email: string;
        willingToPay: string;
        price?: number;
        currency?: string;
        reason?: string;
      } = {
        email: data.email,
        willingToPay: data.willingToPay,
      };

      // For "yes" - send fixed price of 199
      if (data.willingToPay === "yes") {
        payload.willingToPay = "yes";
        payload.price = 199;
        payload.currency = "INR";
        payload.reason = undefined;
      }

      // For "maybe" - send selected price
      if (data.willingToPay === "maybe") {
        payload.willingToPay = "maybe";
        payload.price = data.price; // Already a number
        payload.currency = "INR";
        payload.reason = undefined;
      }

      // For "no" - send reason only
      if (data.willingToPay === "no") {
        payload.willingToPay = "no";
        payload.price = undefined;
        payload.currency = undefined;
        payload.reason = data.reason;
      }

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Submission failed");

      setIsSuccess(true);
      toast.success("You're on the list!");

      // Trigger confetti celebration
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#21D07A", "#ffffff"],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#21D07A", "#ffffff"],
        });
      }, 250);

      // Track form submission
      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({
          event: "form_submit",
          willingness: data.willingToPay,
          price: payload.price,
          reason: payload.reason,
        });
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  if (isSuccess) {
    return (
      <section className="w-full py-20 px-6 flex justify-center bg-transparent">
        <div
          className="max-w-md w-full rounded-xl border shadow-sm"
          style={{
            backgroundColor: "var(--bg-dark-card)",
            borderColor: "var(--border-primary-20)",
          }}
        >
          <MagicCard
            className="text-card-foreground flex flex-col gap-6 py-6"
            gradientColor="var(--bg-dark-card)"
            gradientFrom="var(--brand-primary-alt)"
            gradientTo="#000000"
          >
            <CardContent className="pt-6 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: "var(--brand-primary-alt)" }}
              >
                <CheckCircle2
                  className="w-8 h-8 text-white"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Thanks!</h3>
              <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
                We&apos;ll email you about early access and next steps.
              </p>
              <Button
                className="w-full text-white"
                style={{
                  backgroundColor: "var(--brand-primary-alt)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--brand-primary-alt)";
                  e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--brand-primary-alt)";
                  e.currentTarget.style.opacity = "1";
                }}
                onClick={() => window.location.reload()}
              >
                Submit another response
              </Button>
            </CardContent>
          </MagicCard>
        </div>
      </section>
    );
  }

  return (
    <section
      id="validation"
      className="w-full py-12 md:py-20 px-6 bg-transparent"
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <span
            className="text-xs md:text-sm font-bold tracking-[0.15em] uppercase block mb-4"
            style={{ color: "var(--brand-primary-alt)" }}
          >
            GET EARLY ACCESS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get early access — help us build what actually works for
            freelancers.
          </h2>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            Quick — 30 seconds. Tell us if you&apos;d pay for this.
          </p>
        </div>

        <div
          className="rounded-xl border shadow-sm"
          style={{
            backgroundColor: "var(--bg-dark-card)",
            borderColor: "var(--border-white-5)",
          }}
        >
          <MagicCard
            className="text-card-foreground flex flex-col gap-6 py-6"
            gradientColor="var(--bg-dark-card)"
            gradientFrom="var(--brand-primary-alt)"
            gradientTo="#000000"
          >
            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <input type="hidden" {...form.register("honeypot")} />

                  <FormField
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Email{" "}
                          <span style={{ color: "var(--brand-primary-alt)" }}>
                            *
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            {...field}
                            className="text-white"
                            style={{
                              backgroundColor: "var(--bg-dark)",
                              borderColor: "var(--border-white-10)",
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="willingToPay"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-white">
                          Would you pay for early access at this price?{" "}
                          <span style={{ color: "var(--brand-primary-alt)" }}>
                            *
                          </span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value="yes"
                                  style={{
                                    borderColor: "var(--border-white-30)",
                                    color: "var(--brand-primary-alt)",
                                  }}
                                />
                              </FormControl>
                              <FormLabel
                                className="font-normal cursor-pointer"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                Yes — I&apos;ll pay ₹199
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value="maybe"
                                  style={{
                                    borderColor: "var(--border-white-30)",
                                    color: "var(--brand-primary-alt)",
                                  }}
                                />
                              </FormControl>
                              <FormLabel
                                className="font-normal cursor-pointer"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                Maybe — depends on price
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value="no"
                                  style={{
                                    borderColor: "var(--border-white-30)",
                                    color: "var(--brand-primary-alt)",
                                  }}
                                />
                              </FormControl>
                              <FormLabel
                                className="font-normal cursor-pointer"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                No — I won&apos;t pay
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Progressive disclosure: Price options when "maybe" */}
                  {willingToPay === "maybe" && (
                    <div
                      className={`space-y-3 ${
                        prefersReducedMotion
                          ? ""
                          : "animate-in fade-in slide-in-from-top-2 duration-300"
                      }`}
                      role="region"
                      aria-label="Price options"
                    >
                      <FormField
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white text-sm">
                              Select your preferred price:
                            </FormLabel>
                            <div className="flex flex-wrap gap-3">
                              {PRICE_OPTIONS.map((priceOption) => {
                                const isSelected =
                                  priceOption === "Other"
                                    ? priceIsOther
                                    : field.value === Number(priceOption);

                                return (
                                  <Button
                                    key={priceOption}
                                    type="button"
                                    variant={isSelected ? "default" : "outline"}
                                    className={
                                      isSelected ? "text-white" : "text-white"
                                    }
                                    style={
                                      isSelected
                                        ? {
                                            backgroundColor:
                                              "var(--brand-primary-alt)",
                                            borderColor:
                                              "var(--brand-primary-alt)",
                                          }
                                        : {
                                            backgroundColor: "var(--bg-dark)",
                                            borderColor:
                                              "var(--border-white-10)",
                                          }
                                    }
                                    onMouseEnter={(e) => {
                                      if (!isSelected) {
                                        e.currentTarget.style.backgroundColor =
                                          "rgba(255, 255, 255, 0.05)";
                                      } else {
                                        e.currentTarget.style.opacity = "0.9";
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (!isSelected) {
                                        e.currentTarget.style.backgroundColor =
                                          "var(--bg-dark)";
                                      } else {
                                        e.currentTarget.style.opacity = "1";
                                      }
                                    }}
                                    onClick={() => {
                                      if (priceOption === "Other") {
                                        form.setValue("priceIsOther", true);
                                        field.onChange(undefined);
                                      } else {
                                        form.setValue("priceIsOther", false);
                                        field.onChange(Number(priceOption));
                                      }
                                    }}
                                  >
                                    {priceOption === "Other"
                                      ? "Other"
                                      : `₹${priceOption}/mo`}
                                  </Button>
                                );
                              })}
                            </div>
                          </FormItem>
                        )}
                      />

                      {priceIsOther && willingToPay === "maybe" && (
                        <FormField
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter amount (₹)"
                                  value={field.value || ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    field.onChange(
                                      val ? Number(val) : undefined
                                    );
                                  }}
                                  className="text-white"
                                  style={{
                                    backgroundColor: "var(--bg-dark)",
                                    borderColor: "var(--border-white-10)",
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}

                  {/* Progressive disclosure: Reason chips when "no" */}
                  {willingToPay === "no" && (
                    <div
                      className={`space-y-3 ${
                        prefersReducedMotion
                          ? ""
                          : "animate-in fade-in slide-in-from-top-2 duration-300"
                      }`}
                      role="region"
                      aria-label="Reason for not paying"
                    >
                      <FormField
                        name="reason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white text-sm">
                              Why not?
                            </FormLabel>
                            <div className="flex flex-wrap gap-2">
                              {REASON_OPTIONS.map((reasonOption) => {
                                const isSelected =
                                  reasonOption === "Other"
                                    ? reasonIsOther
                                    : field.value === reasonOption;

                                return (
                                  <Button
                                    key={reasonOption}
                                    type="button"
                                    variant={isSelected ? "default" : "outline"}
                                    size="sm"
                                    className={
                                      isSelected ? "text-white" : "text-white"
                                    }
                                    style={
                                      isSelected
                                        ? {
                                            backgroundColor:
                                              "var(--brand-primary-alt)",
                                            borderColor:
                                              "var(--brand-primary-alt)",
                                          }
                                        : {
                                            backgroundColor: "var(--bg-dark)",
                                            borderColor:
                                              "var(--border-white-10)",
                                          }
                                    }
                                    onMouseEnter={(e) => {
                                      if (!isSelected) {
                                        e.currentTarget.style.backgroundColor =
                                          "rgba(255, 255, 255, 0.05)";
                                      } else {
                                        e.currentTarget.style.opacity = "0.9";
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (!isSelected) {
                                        e.currentTarget.style.backgroundColor =
                                          "var(--bg-dark)";
                                      } else {
                                        e.currentTarget.style.opacity = "1";
                                      }
                                    }}
                                    onClick={() => {
                                      if (reasonOption === "Other") {
                                        form.setValue("reasonIsOther", true);
                                        field.onChange(undefined);
                                      } else {
                                        form.setValue("reasonIsOther", false);
                                        field.onChange(reasonOption);
                                      }
                                    }}
                                  >
                                    {reasonOption}
                                  </Button>
                                );
                              })}
                            </div>
                          </FormItem>
                        )}
                      />

                      {reasonIsOther && willingToPay === "no" && (
                        <FormField
                          name="reason"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Tell us why..."
                                  value={field.value || ""}
                                  onChange={(e) =>
                                    field.onChange(e.target.value)
                                  }
                                  className="text-white"
                                  style={{
                                    backgroundColor: "var(--bg-dark)",
                                    borderColor: "var(--border-white-10)",
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full text-white font-bold h-12 text-lg flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: "var(--brand-primary-alt)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                    disabled={form.formState.isSubmitting}
                  >
                    <Sparkles className="w-5 h-5" aria-hidden="true" />
                    {form.formState.isSubmitting
                      ? "Submitting..."
                      : "Get Early Access"}
                  </Button>

                  <p
                    className="text-xs text-center"
                    style={{ color: "rgba(201, 201, 201, 0.6)" }}
                  >
                    By clicking this button, you agree to receive early access
                    emails and product updates. Unsubscribe anytime.{" "}
                    <a
                      href="/privacy"
                      className="underline"
                      style={{ color: "var(--brand-primary-alt)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color =
                          "var(--brand-primary-alt)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color =
                          "var(--brand-primary-alt)")
                      }
                    >
                      Privacy
                    </a>
                  </p>
                </form>
              </Form>
            </CardContent>
          </MagicCard>
        </div>
      </div>
    </section>
  );
};
