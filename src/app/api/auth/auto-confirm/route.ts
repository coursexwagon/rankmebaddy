import { NextRequest, NextResponse } from "next/server";

// Auto-confirm route has been DISABLED for security.
// Users must verify their email before gaining access to the app.
// This prevents abuse with temp mail and unauthorized access.

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Email verification is required. Please check your inbox." },
    { status: 403 }
  );
}
