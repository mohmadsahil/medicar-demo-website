import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import Application from "@/models/Application";
import User from "@/models/User";

function verifyAdmin(req: NextRequest): boolean {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return false;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    await connectDB();

    const [contacts, applications, users] = await Promise.all([
      Contact.find().sort({ createdAt: -1 }).lean(),
      Application.find().sort({ createdAt: -1 }).lean(),
      User.find().select("-password").sort({ createdAt: -1 }).lean(),
    ]);

    return NextResponse.json({ contacts, applications, users });
  } catch (err) {
    console.error("[admin/data]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
