import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = [
  "/appointments/book",
  "/portal",
  "/consent",
  "/admin",
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("refresh_token")?.value;
  if (!token) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/appointments/book",
    "/portal/:path*",
    "/consent/:path*",
    "/admin/:path*",
  ],
};
