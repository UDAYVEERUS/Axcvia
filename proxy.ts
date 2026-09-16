import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Optimistic gate only: bounce visitors with no session cookie away from
 * signed-in areas before any rendering. It never decides authorization —
 * every page, Server Action and Route Handler still verifies the session and
 * role itself (lib/student/auth.ts, lib/admin/auth.ts).
 */
export function proxy(request: NextRequest) {
  if (getSessionCookie(request)) return NextResponse.next();
  const { pathname, search } = request.nextUrl;
  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  const login = new URL("/login", request.url);
  login.searchParams.set("next", pathname + search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/dashboard/:path*", "/learn/:path*", "/checkout/:path*", "/admin", "/admin/((?!login).*)"],
};
