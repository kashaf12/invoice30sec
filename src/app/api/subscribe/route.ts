import { NextResponse } from "next/server";

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

    // TODO: Integrate with your email service provider (Mailchimp, SendGrid, etc.)
    // For now, we'll just log it and return success
    console.log("Newsletter subscription:", email);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In production, you would:
    // 1. Add to your email service provider
    // 2. Store in database
    // 3. Send confirmation email
    
    return NextResponse.json({ 
      success: true,
      message: "Successfully subscribed to newsletter" 
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
