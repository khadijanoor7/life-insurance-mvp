import { NextRequest, NextResponse } from "next/server";

// List of protected routes
const protectedRoutes = ["/recommendations", "/profile"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token");

  // If user is authenticated and tries to access /auth, redirect to /recommendations
  if (pathname.startsWith("/auth") && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/recommendations";
    return NextResponse.redirect(url);
  }

  // If route is protected and user is not authenticated, redirect to /auth
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|.*\\..*).*)"],
};
