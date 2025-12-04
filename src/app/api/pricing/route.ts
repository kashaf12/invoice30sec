import { NextResponse } from "next/server";
import { getPricingForCountry } from "@/lib/pricing";

// Force dynamic rendering for API routes
export const dynamic = "force-dynamic";

/**
 * GET /api/pricing
 * Returns pricing configuration based on user's country
 * Uses Vercel's x-vercel-ip-country header for country detection
 */
export async function GET(request: Request) {
  try {
    // Detect country from Vercel headers
    const countryCode = request.headers.get("x-vercel-ip-country") || null;

    // Get pricing configuration for the country
    const pricing = getPricingForCountry(countryCode);

    return NextResponse.json(
      {
        country: countryCode || "Unknown",
        pricing,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "public, s-maxage=43200, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Pricing API error:", error);

    // Return default pricing on error
    const { DEFAULT_PRICING } = await import("@/lib/pricing");
    const defaultPricing = DEFAULT_PRICING;

    return NextResponse.json(
      {
        country: "Unknown",
        pricing: defaultPricing,
      },
      {
        status: 200, // Still return 200 with default pricing
        headers: {
          "Cache-Control":
            "public, s-maxage=43200, stale-while-revalidate=86400",
        },
      }
    );
  }
}
