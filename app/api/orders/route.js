import connectDB from "@/app/lib/dbConnect";
import Order from "@/app/models/Order";
import { NextResponse } from "next/server";

// POST => create new order
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    console.log("Received order body:", body); // ⚡ debug

    const newOrder = await Order.create(body);

    return NextResponse.json({
      success: true,
      data: newOrder,
      message: "✅ Order placed successfully!",
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json(
      { success: false, message: "❌ Failed to place order." },
      { status: 500 }
    );
  }
}

// GET => fetch all orders
export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: "❌ Failed to fetch orders." },
      { status: 500 }
    );
  }
}
