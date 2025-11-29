import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Basic email validation
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Connect to Neon database
    const sql = neon(process.env.DATABASE_URL!);

    // Insert subscription (or update if already exists)
    const result = await sql`
      INSERT INTO subscriptions (email, is_active)
      VALUES (${email}, true)
      ON CONFLICT (email) 
      DO UPDATE SET is_active = true, unsubscribed_at = NULL
      RETURNING id, subscribed_at
    `;

    const subscription = result[0];
    
    return NextResponse.json({ 
      success: true,
      message: "Successfully subscribed to newsletter",
      id: subscription.id
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
