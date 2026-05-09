import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

/* ─── Configuration ──────────────────────────────────────────── */
const FREE_CREDITS_PER_RESET = 25;
const PRO_CREDITS_PER_RESET = 100;
const ENTERPRISE_CREDITS_PER_RESET = 999;
const RESET_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

type Tier = "free" | "pro" | "enterprise";

function getCreditsForTier(tier: Tier): number {
  switch (tier) {
    case "pro": return PRO_CREDITS_PER_RESET;
    case "enterprise": return ENTERPRISE_CREDITS_PER_RESET;
    default: return FREE_CREDITS_PER_RESET;
  }
}

interface CreditRecord {
  user_id: string;
  credits_remaining: number;
  total_used: number;
  total_refunded: number;
  tier: Tier;
  last_reset_at: string;
  created_at: string;
}

/* ─── Helper: ensure user credit record exists ──────────────── */
async function ensureCreditRecord(userId: string): Promise<{ record: CreditRecord | null; error: string | null }> {
  const { data, error } = await supabaseAdmin
    .from("user_credits")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code === "PGRST116") {
    // No record yet — create one
    const now = new Date().toISOString();
    const tier: Tier = "free";
    const { data: newData, error: insertError } = await supabaseAdmin
      .from("user_credits")
      .insert({
        user_id: userId,
        credits_remaining: FREE_CREDITS_PER_RESET,
        total_used: 0,
        total_refunded: 0,
        tier,
        last_reset_at: now,
        created_at: now,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Credits insert error:", insertError);
      return { record: null, error: "Failed to create credit record" };
    }

    return { record: newData as CreditRecord, error: null };
  }

  if (error) {
    console.error("Credits fetch error:", error);
    return { record: null, error: "Failed to fetch credit record" };
  }

  return { record: data as CreditRecord, error: null };
}

/* ─── Helper: check and perform reset if needed ─────────────── */
async function checkAndResetCredits(record: CreditRecord): Promise<CreditRecord> {
  const lastReset = new Date(record.last_reset_at).getTime();
  const now = Date.now();
  const maxCredits = getCreditsForTier(record.tier);

  if (now - lastReset >= RESET_INTERVAL_MS && record.credits_remaining < maxCredits) {
    const { data: updatedData, error: updateError } = await supabaseAdmin
      .from("user_credits")
      .update({
        credits_remaining: maxCredits,
        last_reset_at: new Date(now).toISOString(),
      })
      .eq("user_id", record.user_id)
      .select()
      .single();

    if (updatedData && !updateError) {
      return updatedData as CreditRecord;
    }
  }

  return record;
}

/* ─── GET: Retrieve credit status ───────────────────────────── */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    const { record, error } = await ensureCreditRecord(userId);

    if (error || !record) {
      // DENY on error — don't return fake credits
      return NextResponse.json(
        { error: error || "Unable to retrieve credits", credits_remaining: 0, total_used: 0, tier: "free" as Tier, max_credits: FREE_CREDITS_PER_RESET, next_reset: new Date(Date.now() + RESET_INTERVAL_MS).toISOString() },
        { status: 500 }
      );
    }

    const currentRecord = await checkAndResetCredits(record);
    const maxCredits = getCreditsForTier(currentRecord.tier);

    return NextResponse.json({
      credits_remaining: currentRecord.credits_remaining,
      total_used: currentRecord.total_used,
      total_refunded: currentRecord.total_refunded,
      tier: currentRecord.tier,
      max_credits: maxCredits,
      next_reset: new Date(new Date(currentRecord.last_reset_at).getTime() + RESET_INTERVAL_MS).toISOString(),
    });
  } catch (err) {
    console.error("Credits GET error:", err);
    // DENY on error — don't leak default credits
    return NextResponse.json(
      { error: "Credits service unavailable", credits_remaining: 0, tier: "free" as Tier, max_credits: FREE_CREDITS_PER_RESET },
      { status: 503 }
    );
  }
}

/* ─── POST: Verify credits (check-only, no deduction) ──────── */
export async function POST(request: NextRequest) {
  try {
    const { userId, action } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    // Action: "check" = verify credits without deducting, "deduct" = deduct after success
    if (action === "check") {
      return handleCheckCredits(userId);
    }

    if (action === "deduct") {
      return handleDeductCredits(userId);
    }

    if (action === "refund") {
      const { amount } = await request.json().catch(() => ({ amount: 1 }));
      return handleRefundCredits(userId, amount || 1);
    }

    // Default: check + deduct (legacy behavior for backward compat)
    return handleCheckAndDeduct(userId);
  } catch (err) {
    console.error("Credits POST error:", err);
    // DENY on error — never allow through on failure
    return NextResponse.json(
      { allowed: false, error: "Credits service unavailable", credits_remaining: 0 },
      { status: 503 }
    );
  }
}

/* ─── Check credits without deducting ──────────────────────── */
async function handleCheckCredits(userId: string) {
  const { record, error } = await ensureCreditRecord(userId);

  if (error || !record) {
    return NextResponse.json({
      allowed: false,
      error: error || "Unable to verify credits",
      credits_remaining: 0,
      tier: "free" as Tier,
      max_credits: FREE_CREDITS_PER_RESET,
    }, { status: 500 });
  }

  const currentRecord = await checkAndResetCredits(record);
  const maxCredits = getCreditsForTier(currentRecord.tier);

  if (currentRecord.credits_remaining <= 0) {
    return NextResponse.json({
      allowed: false,
      credits_remaining: 0,
      tier: currentRecord.tier,
      max_credits: maxCredits,
      next_reset: new Date(new Date(currentRecord.last_reset_at).getTime() + RESET_INTERVAL_MS).toISOString(),
      message: "No credits remaining. Credits reset every hour.",
    });
  }

  return NextResponse.json({
    allowed: true,
    credits_remaining: currentRecord.credits_remaining,
    tier: currentRecord.tier,
    max_credits: maxCredits,
    next_reset: new Date(new Date(currentRecord.last_reset_at).getTime() + RESET_INTERVAL_MS).toISOString(),
  });
}

/* ─── Deduct one credit (called AFTER successful AI response) ─ */
async function handleDeductCredits(userId: string) {
  const { record, error } = await ensureCreditRecord(userId);

  if (error || !record) {
    return NextResponse.json({
      success: false,
      error: error || "Unable to deduct credits",
      credits_remaining: 0,
    }, { status: 500 });
  }

  const currentRecord = await checkAndResetCredits(record);
  const maxCredits = getCreditsForTier(currentRecord.tier);

  if (currentRecord.credits_remaining <= 0) {
    return NextResponse.json({
      success: false,
      error: "No credits to deduct",
      credits_remaining: 0,
      tier: currentRecord.tier,
      max_credits: maxCredits,
      next_reset: new Date(new Date(currentRecord.last_reset_at).getTime() + RESET_INTERVAL_MS).toISOString(),
    }, { status: 429 });
  }

  // Deduct one credit
  const { error: updateError } = await supabaseAdmin
    .from("user_credits")
    .update({
      credits_remaining: currentRecord.credits_remaining - 1,
      total_used: currentRecord.total_used + 1,
    })
    .eq("user_id", userId);

  if (updateError) {
    console.error("Credits deduct error:", updateError);
    return NextResponse.json({
      success: false,
      error: "Failed to deduct credits",
      credits_remaining: currentRecord.credits_remaining,
    }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    credits_remaining: currentRecord.credits_remaining - 1,
    tier: currentRecord.tier,
    max_credits: maxCredits,
    next_reset: new Date(new Date(currentRecord.last_reset_at).getTime() + RESET_INTERVAL_MS).toISOString(),
  });
}

/* ─── Refund credits (called when AI call fails after deduction) ─ */
async function handleRefundCredits(userId: string, amount: number) {
  const { record, error } = await ensureCreditRecord(userId);

  if (error || !record) {
    return NextResponse.json({
      success: false,
      error: error || "Unable to refund credits",
    }, { status: 500 });
  }

  const maxCredits = getCreditsForTier(record.tier);
  const newCredits = Math.min(record.credits_remaining + amount, maxCredits);

  const { error: updateError } = await supabaseAdmin
    .from("user_credits")
    .update({
      credits_remaining: newCredits,
      total_refunded: record.total_refunded + amount,
    })
    .eq("user_id", userId);

  if (updateError) {
    console.error("Credits refund error:", updateError);
    return NextResponse.json({
      success: false,
      error: "Failed to refund credits",
    }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    credits_remaining: newCredits,
    tier: record.tier,
    max_credits: maxCredits,
    message: `Refunded ${amount} credit(s)`,
  });
}

/* ─── Legacy: Check + Deduct in one call ───────────────────── */
async function handleCheckAndDeduct(userId: string) {
  const { record, error } = await ensureCreditRecord(userId);

  if (error || !record) {
    // DENY on error — never allow through
    return NextResponse.json({
      allowed: false,
      error: error || "Unable to verify credits",
      credits_remaining: 0,
    }, { status: 500 });
  }

  const currentRecord = await checkAndResetCredits(record);
  const maxCredits = getCreditsForTier(currentRecord.tier);

  if (currentRecord.credits_remaining <= 0) {
    return NextResponse.json({
      allowed: false,
      credits_remaining: 0,
      tier: currentRecord.tier,
      max_credits: maxCredits,
      next_reset: new Date(new Date(currentRecord.last_reset_at).getTime() + RESET_INTERVAL_MS).toISOString(),
      message: "No credits remaining. Credits reset every hour.",
    });
  }

  // Deduct one credit
  const { error: updateError } = await supabaseAdmin
    .from("user_credits")
    .update({
      credits_remaining: currentRecord.credits_remaining - 1,
      total_used: currentRecord.total_used + 1,
    })
    .eq("user_id", userId);

  if (updateError) {
    console.error("Credits deduct error:", updateError);
    // Still allow the request but report the error
    return NextResponse.json({
      allowed: true,
      credits_remaining: currentRecord.credits_remaining,
      tier: currentRecord.tier,
      max_credits: maxCredits,
      warning: "Credit deduction failed but request allowed",
    });
  }

  return NextResponse.json({
    allowed: true,
    credits_remaining: currentRecord.credits_remaining - 1,
    tier: currentRecord.tier,
    max_credits: maxCredits,
    next_reset: new Date(new Date(currentRecord.last_reset_at).getTime() + RESET_INTERVAL_MS).toISOString(),
  });
}
