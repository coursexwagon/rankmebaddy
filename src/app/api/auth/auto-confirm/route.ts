import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// This route uses the SERVICE ROLE KEY to auto-confirm users during beta
// This bypasses the email verification step so users can sign in immediately
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  // Only allow in beta mode
  if (process.env.NEXT_PUBLIC_BETA_MODE !== "true") {
    return NextResponse.json({ error: "Auto-confirm only available in beta" }, { status: 403 });
  }

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find the user by email
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      console.error("List users error:", listError.message);
      return NextResponse.json({ error: "Failed to find user" }, { status: 500 });
    }

    const user = users.find(u => u.email === email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If already confirmed, no action needed
    if (user.email_confirmed_at) {
      return NextResponse.json({ confirmed: true, message: "Already confirmed" });
    }

    // Auto-confirm the user using admin API
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { email_confirm: true }
    );

    if (updateError) {
      console.error("Auto-confirm error:", updateError.message);
      return NextResponse.json({ error: "Failed to confirm user" }, { status: 500 });
    }

    console.log(`Auto-confirmed user: ${email}`);
    return NextResponse.json({ confirmed: true, message: "User auto-confirmed" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Auto-confirm error:", message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
