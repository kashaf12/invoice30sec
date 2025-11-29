export interface LeadPayload {
  email: string;
  willingToPay: "yes" | "maybe" | "no";
  price?: number;
  currency?: string;
  reason?: string;
  honeypot?: string;
  country?: string; // auto-detected server-side
  utm?: string; // auto-captured from query params
  userAgent?: string; // auto-captured
  ip?: string; // auto-captured
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export const isEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const required = (value: any): boolean => {
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "boolean") return value === true;
  return value !== null && value !== undefined;
};

export const validateLead = (payload: LeadPayload): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!required(payload.email)) {
    errors.email = "Email is required";
  } else if (!isEmail(payload.email)) {
    errors.email = "Invalid email address";
  }

  if (!required(payload.willingToPay)) {
    errors.willingToPay = "Please select an option";
  }

  // If "maybe" selected, price should be provided
  if (payload.willingToPay === "maybe" && !required(payload.price)) {
    errors.price = "Please select a price option";
  }

  // If "no" selected, reason should be provided
  if (payload.willingToPay === "no" && !required(payload.reason)) {
    errors.reason = "Please select a reason";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
