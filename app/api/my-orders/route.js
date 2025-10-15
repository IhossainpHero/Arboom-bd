import connectDB from "@/app/lib/dbConnect";
import Order from "@/app/models/Order";
import { NextResponse } from "next/server";

// GET => fetch orders by phone only
export async function GET(request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const phone = url.searchParams.get("phone"); // query param

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "❌ Please provide your phone number." },
        { status: 400 }
      );
    }

    const orders = await Order.find({ phone }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: "❌ Failed to fetch orders." },
      { status: 500 }
    );
  }
}
