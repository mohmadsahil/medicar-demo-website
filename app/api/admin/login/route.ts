import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ADMIN_EMAIL = "demo.admin@gmail.com";
const ADMIN_PASSWORD = "Digital@9694";
const ADMIN_COOKIE = "admin_token";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (
      email?.toLowerCase().trim() !== ADMIN_EMAIL ||
      password !== ADMIN_PASSWORD
    ) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const token = jwt.sign(
      { role: "admin", email: ADMIN_EMAIL },
      process.env.JWT_SECRET!,
      { expiresIn: "8h" }
    );

    const response = NextResponse.json({ message: "Authenticated." });
    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[admin/login]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
