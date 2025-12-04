/**
 * Country-based pricing configuration
 * Prices are adjusted based on purchasing power parity and local market conditions
 */

export interface PricingConfig {
  currency: string;
  currencySymbol: string;
  prices: {
    default: number; // For "yes" option
    options: number[]; // For "maybe" option
  };
}

export type CountryCode = string;

// Pricing configuration by country code
export const PRICING_BY_COUNTRY: Record<CountryCode, PricingConfig> = {
  // India - INR
  IN: {
    currency: "INR",
    currencySymbol: "₹",
    prices: {
      default: 199,
      options: [149, 199, 299],
    },
  },
  // United States - USD
  US: {
    currency: "USD",
    currencySymbol: "$",
    prices: {
      default: 5,
      options: [3, 5, 10],
    },
  },
  // Japan - JPY
  JP: {
    currency: "JPY",
    currencySymbol: "¥",
    prices: {
      default: 800,
      options: [500, 800, 1000],
    },
  },
  // United Kingdom - GBP
  GB: {
    currency: "GBP",
    currencySymbol: "£",
    prices: {
      default: 4,
      options: [3, 4, 7],
    },
  },
  // Canada - CAD
  CA: {
    currency: "CAD",
    currencySymbol: "$",
    prices: {
      default: 7,
      options: [5, 7, 12],
    },
  },
  // Australia - AUD
  AU: {
    currency: "AUD",
    currencySymbol: "$",
    prices: {
      default: 8,
      options: [5, 8, 15],
    },
  },
  // Germany - EUR
  DE: {
    currency: "EUR",
    currencySymbol: "€",
    prices: {
      default: 5,
      options: [3, 5, 9],
    },
  },
  // France - EUR
  FR: {
    currency: "EUR",
    currencySymbol: "€",
    prices: {
      default: 5,
      options: [3, 5, 9],
    },
  },
  // Italy - EUR
  IT: {
    currency: "EUR",
    currencySymbol: "€",
    prices: {
      default: 5,
      options: [3, 5, 9],
    },
  },
  // Spain - EUR
  ES: {
    currency: "EUR",
    currencySymbol: "€",
    prices: {
      default: 5,
      options: [3, 5, 9],
    },
  },
  // Netherlands - EUR
  NL: {
    currency: "EUR",
    currencySymbol: "€",
    prices: {
      default: 5,
      options: [3, 5, 9],
    },
  },
  // Singapore - SGD
  SG: {
    currency: "SGD",
    currencySymbol: "$",
    prices: {
      default: 7,
      options: [5, 7, 12],
    },
  },
  // United Arab Emirates - AED
  AE: {
    currency: "AED",
    currencySymbol: "د.إ",
    prices: {
      default: 20,
      options: [15, 20, 35],
    },
  },
  // Brazil - BRL
  BR: {
    currency: "BRL",
    currencySymbol: "R$",
    prices: {
      default: 25,
      options: [15, 25, 45],
    },
  },
  // Mexico - MXN
  MX: {
    currency: "MXN",
    currencySymbol: "$",
    prices: {
      default: 100,
      options: [70, 100, 180],
    },
  },
  // South Korea - KRW
  KR: {
    currency: "KRW",
    currencySymbol: "₩",
    prices: {
      default: 7000,
      options: [5000, 7000, 12000],
    },
  },
  // China - CNY
  CN: {
    currency: "CNY",
    currencySymbol: "¥",
    prices: {
      default: 35,
      options: [25, 35, 60],
    },
  },
};

// Default pricing (fallback to United States/USD)
export const DEFAULT_PRICING: PricingConfig = PRICING_BY_COUNTRY.US;

/**
 * Get pricing configuration for a country
 * Falls back to default (United States/USD) if country not found
 */
export function getPricingForCountry(
  countryCode: string | null | undefined
): PricingConfig {
  if (!countryCode) {
    return DEFAULT_PRICING;
  }

  const upperCountryCode = countryCode.toUpperCase();
  return PRICING_BY_COUNTRY[upperCountryCode] || DEFAULT_PRICING;
}

/**
 * Format price with currency symbol
 */
export function formatPrice(amount: number, currencySymbol: string): string {
  return `${currencySymbol}${amount}`;
}

/**
 * Format price with currency symbol and period
 */
export function formatPriceWithPeriod(
  amount: number,
  currencySymbol: string,
  period: string = "/mo"
): string {
  return `${currencySymbol}${amount}${period}`;
}
