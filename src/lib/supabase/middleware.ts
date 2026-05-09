import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session — this is critical for SSR auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protected routes: redirect to /auth if not authenticated
  const protectedRoutes = ["/dashboard", "/onboarding"];
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      const authUrl = new URL("/auth", request.url);
      authUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(authUrl);
    }

    // Email verification check — users must verify their email before accessing protected routes
    if (!user.email_confirmed_at) {
      const authUrl = new URL("/auth", request.url);
      authUrl.searchParams.set("next", pathname);
      authUrl.searchParams.set("verification_required", "true");
      return NextResponse.redirect(authUrl);
    }
  }

  // Auth routes: redirect to /dashboard if already authenticated AND verified
  const authRoutes = ["/auth"];
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (user && user.email_confirmed_at) {
      const next = request.nextUrl.searchParams.get("next") ?? "/dashboard";
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return supabaseResponse;
}
