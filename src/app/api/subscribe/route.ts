import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Force dynamic rendering for API routes (POST operations must be dynamic)
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // Parse request body
    let body: { email?: string };
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store, must-revalidate",
          },
        }
      );
    }

    const { email } = body;

    // Basic email validation
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store, must-revalidate",
          },
        }
      );
    }

    // Trim and normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store, must-revalidate",
          },
        }
      );
    }

    // Validate environment variable
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Connect to Neon database
    const sql = neon(process.env.DATABASE_URL);

    // Insert subscription (or update if already exists)
    const result = await sql`
      INSERT INTO subscriptions (email, is_active)
      VALUES (${normalizedEmail}, true)
      ON CONFLICT (email) 
      DO UPDATE SET is_active = true, unsubscribed_at = NULL
      RETURNING id, subscribed_at
    `;

    const subscription = result[0];

    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed to newsletter",
        id: subscription.id,
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    // Log error for debugging but don't expose details to client
    console.error("Subscribe error:", error);

    // Check if it's a database error
    if (error instanceof Error && error.message.includes("database")) {
      return NextResponse.json(
        { error: "Database error. Please try again later." },
        {
          status: 503,
          headers: {
            "Cache-Control": "no-store, must-revalidate",
          },
        }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, must-revalidate",
        },
      }
    );
  }
}
