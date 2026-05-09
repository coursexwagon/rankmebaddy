import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // If using hash-based routing (common with Supabase OAuth)
  const next = searchParams.get("next") ?? "/onboarding";

  if (code) {
    // We need to exchange the code for a session using the Supabase client
    // For client-side auth, we'll redirect to a page that handles the exchange
    const redirectUrl = `${origin}/auth/confirm?code=${code}&next=${next}`;
    return NextResponse.redirect(redirectUrl);
  }

  // Fallback: redirect to auth page
  return NextResponse.redirect(`${origin}/auth`);
}
