import { NextResponse } from "next/server";
import { validateLead, LeadPayload } from "@/lib/validate";
import { neon } from "@neondatabase/serverless";

const MAX_LEADS_RETURN = 200; // admin viewer cap

// Helper: extract IP from request headers
function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return null;
}

// Helper: detect country from Vercel headers
function detectCountry(request: Request): string {
  return request.headers.get("x-vercel-ip-country") || "Unknown";
}

export async function POST(request: Request) {
  try {
    const body: LeadPayload = await request.json();

    // Honeypot
    if (body.honeypot) {
      return NextResponse.json({ status: "ok" });
    }

    // Detect country from IP
    const clientIp = getClientIp(request);
    const country = detectCountry(request);

    // Capture user agent
    const userAgent = request.headers.get("user-agent") || "Unknown";

    // Validation
    const validation = validateLead(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 422 }
      );
    }

    // Connect to Neon database
    const sql = neon(process.env.DATABASE_URL!);

    // Insert lead into database
    const result = await sql`
      INSERT INTO leads (email, willing_to_pay, price, currency, reason, country, ip_address, user_agent)
      VALUES (${body.email}, ${body.willingToPay}, ${body.price || null}, ${body.currency || null}, ${body.reason || null}, ${country}, ${clientIp}, ${userAgent})
      RETURNING id, submitted_at
    `;

    const lead = result[0];

    return NextResponse.json({ 
      id: lead.id, 
      status: "ok",
      submittedAt: lead.submitted_at
    });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Admin viewer endpoint: GET /api/leads?limit=50
export async function GET(request: Request) {
  try {
    // Optional simple auth: use a secret header or ENV guard
    const adminSecret = process.env.LEADS_ADMIN_SECRET;
    const auth = request.headers.get("x-admin-secret");
    if (!adminSecret || auth !== adminSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const limit = Math.min(Number(url.searchParams.get("limit") || "50"), MAX_LEADS_RETURN);

    // Connect to Neon database
    const sql = neon(process.env.DATABASE_URL!);

    // Fetch leads from database (most recent first)
    const leads = await sql`
      SELECT id, email, willing_to_pay, price, currency, reason, country, ip_address, user_agent, submitted_at
      FROM leads
      ORDER BY submitted_at DESC
      LIMIT ${limit}
    `;

    return NextResponse.json({ count: leads.length, leads });
  } catch (error) {
    console.error("Leads GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
