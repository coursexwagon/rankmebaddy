import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const FREE_CREDITS_PER_RESET = 10;
const RESET_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    // Look up user's credits in Supabase
    const { data, error } = await supabaseAdmin
      .from("user_credits")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code === "PGRST116") {
      // No record yet — create one
      const now = new Date().toISOString();
      const { data: newData, error: insertError } = await supabaseAdmin
        .from("user_credits")
        .insert({
          user_id: userId,
          credits_remaining: FREE_CREDITS_PER_RESET,
          total_used: 0,
          last_reset_at: now,
          created_at: now,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Credits insert error:", insertError);
        // Table might not exist yet — return default credits
        return NextResponse.json({
          credits_remaining: FREE_CREDITS_PER_RESET,
          total_used: 0,
          next_reset: new Date(Date.now() + RESET_INTERVAL_MS).toISOString(),
        });
      }

      return NextResponse.json({
        credits_remaining: newData.credits_remaining,
        total_used: newData.total_used,
        next_reset: new Date(new Date(now).getTime() + RESET_INTERVAL_MS).toISOString(),
      });
    }

    if (error) {
      console.error("Credits fetch error:", error);
      // Return default if table doesn't exist
      return NextResponse.json({
        credits_remaining: FREE_CREDITS_PER_RESET,
        total_used: 0,
        next_reset: new Date(Date.now() + RESET_INTERVAL_MS).toISOString(),
      });
    }

    // Check if credits should reset
    const lastReset = new Date(data.last_reset_at).getTime();
    const now = Date.now();
    const timeSinceReset = now - lastReset;

    if (timeSinceReset >= RESET_INTERVAL_MS && data.credits_remaining < FREE_CREDITS_PER_RESET) {
      // Reset credits
      const { data: updatedData, error: updateError } = await supabaseAdmin
        .from("user_credits")
        .update({
          credits_remaining: FREE_CREDITS_PER_RESET,
          last_reset_at: new Date(now).toISOString(),
        })
        .eq("user_id", userId)
        .select()
        .single();

      if (updatedData) {
        return NextResponse.json({
          credits_remaining: updatedData.credits_remaining,
          total_used: updatedData.total_used,
          next_reset: new Date(now + RESET_INTERVAL_MS).toISOString(),
        });
      }
    }

    return NextResponse.json({
      credits_remaining: data.credits_remaining,
      total_used: data.total_used,
      next_reset: new Date(lastReset + RESET_INTERVAL_MS).toISOString(),
    });
  } catch (err) {
    console.error("Credits API error:", err);
    return NextResponse.json({
      credits_remaining: FREE_CREDITS_PER_RESET,
      total_used: 0,
      next_reset: new Date(Date.now() + RESET_INTERVAL_MS).toISOString(),
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    // Look up user's credits
    const { data, error } = await supabaseAdmin
      .from("user_credits")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Credits fetch error:", error);
      // Allow the request if table doesn't exist yet — give default credits
      return NextResponse.json({ allowed: true, credits_remaining: FREE_CREDITS_PER_RESET - 1 });
    }

    if (!data) {
      // Create credits record for new user
      const now = new Date().toISOString();
      await supabaseAdmin.from("user_credits").insert({
        user_id: userId,
        credits_remaining: FREE_CREDITS_PER_RESET - 1, // Use one credit for this request
        total_used: 1,
        last_reset_at: now,
        created_at: now,
      });
      return NextResponse.json({ allowed: true, credits_remaining: FREE_CREDITS_PER_RESET - 1 });
    }

    // Check for reset
    const lastReset = new Date(data.last_reset_at).getTime();
    const now = Date.now();
    if (now - lastReset >= RESET_INTERVAL_MS && data.credits_remaining < FREE_CREDITS_PER_RESET) {
      // Reset first, then deduct
      await supabaseAdmin
        .from("user_credits")
        .update({
          credits_remaining: FREE_CREDITS_PER_RESET - 1,
          total_used: data.total_used + 1,
          last_reset_at: new Date(now).toISOString(),
        })
        .eq("user_id", userId);
      return NextResponse.json({ allowed: true, credits_remaining: FREE_CREDITS_PER_RESET - 1 });
    }

    if (data.credits_remaining <= 0) {
      return NextResponse.json({
        allowed: false,
        credits_remaining: 0,
        next_reset: new Date(lastReset + RESET_INTERVAL_MS).toISOString(),
        message: "No credits remaining. Credits reset every hour.",
      });
    }

    // Deduct one credit
    await supabaseAdmin
      .from("user_credits")
      .update({
        credits_remaining: data.credits_remaining - 1,
        total_used: data.total_used + 1,
      })
      .eq("user_id", userId);

    return NextResponse.json({ allowed: true, credits_remaining: data.credits_remaining - 1 });
  } catch (err) {
    console.error("Credits deduction error:", err);
    return NextResponse.json({ allowed: true, credits_remaining: FREE_CREDITS_PER_RESET });
  }
}
