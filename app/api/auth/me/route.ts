import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(auth.userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("[me]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const allowed = ["name", "phone", "role", "company", "bio"];
    const update: Record<string, string> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) update[key] = body[key];
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(
      auth.userId,
      { $set: update },
      { new: true, select: "-password" }
    );

    return NextResponse.json({ user });
  } catch (err) {
    console.error("[me patch]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
