import { useState, useEffect } from "react";
import { PricingConfig, DEFAULT_PRICING } from "@/lib/pricing";

// Simple in-memory cache for pricing data
interface CachedPricing {
  pricing: PricingConfig;
  country: string | null;
}

let cachedData: CachedPricing | null = null;
let cacheTimestamp: number | null = null;
let pendingRequest: Promise<CachedPricing> | null = null;
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

interface UsePricingResult {
  pricing: PricingConfig;
  isLoading: boolean;
  country: string | null;
  error: Error | null;
}

/**
 * Custom hook to fetch and cache country-based pricing
 * Uses in-memory cache to avoid redundant API calls
 */
export function usePricing(): UsePricingResult {
  const [pricing, setPricing] = useState<PricingConfig>(DEFAULT_PRICING);
  const [isLoading, setIsLoading] = useState(true);
  const [country, setCountry] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if cache is still valid
    const now = Date.now();
    const isCacheValid =
      cacheTimestamp && now - cacheTimestamp < CACHE_DURATION;

    // If we have a cached pricing and cache is valid, use it
    if (isCacheValid && cachedData) {
      setPricing(cachedData.pricing);
      setCountry(cachedData.country);
      setIsLoading(false);
      return;
    }

    // If there's already a pending request, wait for it
    if (pendingRequest) {
      pendingRequest
        .then((data) => {
          setPricing(data.pricing);
          setCountry(data.country);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch pricing:", err);
          setError(err instanceof Error ? err : new Error("Unknown error"));
          setPricing(DEFAULT_PRICING);
          setCountry(null);
          setIsLoading(false);
        });
      return;
    }

    // Fetch fresh pricing
    const fetchPricing = async (): Promise<CachedPricing> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/pricing");
        if (!response.ok) {
          throw new Error("Failed to fetch pricing");
        }

        const data = await response.json();
        const fetchedPricing = data.pricing as PricingConfig;
        const fetchedCountry = data.country as string | null;

        // Update cache
        const result: CachedPricing = {
          pricing: fetchedPricing,
          country: fetchedCountry,
        };
        cachedData = result;
        cacheTimestamp = now;

        return result;
      } catch (err) {
        console.error("Failed to fetch pricing:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        // Fallback to default pricing on error
        const fallback: CachedPricing = {
          pricing: DEFAULT_PRICING,
          country: null,
        };
        cachedData = fallback;
        cacheTimestamp = now;
        throw err;
      }
    };

    // Create and store the pending request
    pendingRequest = fetchPricing();

    // Handle the request
    pendingRequest
      .then((data) => {
        setPricing(data.pricing);
        setCountry(data.country);
      })
      .catch(() => {
        setPricing(DEFAULT_PRICING);
        setCountry(null);
      })
      .finally(() => {
        setIsLoading(false);
        pendingRequest = null; // Clear pending request after completion
      });
  }, []);

  return { pricing, isLoading, country, error };
}
