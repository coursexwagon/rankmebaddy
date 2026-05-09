import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/onboarding"];

// Routes that should redirect away if already authenticated
const authRoutes = ["/auth"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for Supabase auth token in cookies
  // Supabase stores the auth token in cookies like: sb-<ref>-auth-token
  const hasAuthToken = request.cookies.getAll().some((cookie) =>
    cookie.name.includes("auth-token")
  );

  // Also check for the common sb- prefix pattern
  const supabaseCookies = request.cookies.getAll().filter((cookie) =>
    cookie.name.startsWith("sb-")
  );
  const isAuthenticated = hasAuthToken || supabaseCookies.length > 0;

  // Protected routes: redirect to /auth if not authenticated
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const authUrl = new URL("/auth", request.url);
      authUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(authUrl);
    }
  }

  // Auth routes: redirect to /dashboard if already authenticated
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      const next = request.nextUrl.searchParams.get("next") ?? "/dashboard";
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
