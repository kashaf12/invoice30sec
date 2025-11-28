import { NextResponse } from "next/server";
import { validateLead, LeadPayload } from "@/lib/validate";
import { kv } from "@vercel/kv";


const RATE_LIMIT_WINDOW_SECONDS = 60; // 1 minute
const LEADS_LIST_KEY = "leads:list";   // list of lead ids (most recent at head)
const LEAD_COUNTER_KEY = "leads:counter";
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

// Helper: apply a simple KV-backed rate limit per email
async function isRateLimited(email: string) {
  if (!email) return false;
  const key = `rl:${email}`;
  const exists = await kv.get(key);
  if (exists) {
    return true;
  }
  await kv.set(key, "1", { ex: RATE_LIMIT_WINDOW_SECONDS });
  return false;
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

    // Rate limit by email
    const email = body.email ?? "anonymous";
    if (await isRateLimited(email)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Generate id atomically
    const id = String(await kv.incr(LEAD_COUNTER_KEY));

    const newLead = {
      id,
      ...body,
      country,
      userAgent,
      submittedAt: new Date().toISOString(),
    };

    // Store lead object and push id to a list for retrieval
    await kv.set(`lead:${id}`, JSON.stringify(newLead));
    
    // push to head of list (recent first)
    if (typeof (kv as any).lpush === "function") {
      await (kv as any).lpush(LEADS_LIST_KEY, id);
    } else {
      const raw = (await kv.get(LEADS_LIST_KEY)) as string | null;
      let arr: string[] = raw ? JSON.parse(raw) : [];
      arr.unshift(id);
      const cap = 10000;
      if (arr.length > cap) arr = arr.slice(0, cap);
      await kv.set(LEADS_LIST_KEY, JSON.stringify(arr));
    }

    return NextResponse.json({ id, status: "ok" });
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

    // Retrieve list of ids
    let ids: string[] = [];

    if (typeof (kv as any).lrange === "function") {
      // If list commands available, get range 0..limit-1
      ids = await (kv as any).lrange(LEADS_LIST_KEY, 0, limit - 1);
    } else {
      // Fallback to JSON array
      const raw = (await kv.get(LEADS_LIST_KEY)) as string | null;
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        ids = arr.slice(0, limit);
      }
    }

    // Batch fetch leads
    const multiGetKeys = ids.map((id) => `lead:${id}`);
    // @vercel/kv supports mget in many wrappers
    let leadsRaw: (string | null)[] = [];
    if (typeof (kv as any).mget === "function") {
      leadsRaw = await (kv as any).mget(...multiGetKeys);
    } else {
      leadsRaw = (await Promise.all(multiGetKeys.map((k) => kv.get(k)))) as (string | null)[];
    }

    const leads = leadsRaw.map((s) => (s ? JSON.parse(s) : null)).filter(Boolean);

    return NextResponse.json({ count: leads.length, leads });
  } catch (error) {
    console.error("Leads GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
