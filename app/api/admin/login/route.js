import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ isAdmin: true }, JWT_SECRET, {
        expiresIn: "1h",
      });
      return NextResponse.json({ success: true, token });
    } else {
      return NextResponse.json(
        { success: false, message: "ভুল ইমেল বা পাসওয়ার্ড।" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "লগইন করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}
