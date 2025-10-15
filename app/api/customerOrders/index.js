import connectDB from "@/app/lib/dbConnect"; // আপনার MongoDB connection ফাইল
import Order from "@/app/models/Order"; // Order model

export default async function handler(req, res) {
  await connectDB();

  const { phone } = req.query;

  if (req.method === "GET") {
    try {
      const orders = await Order.find({ phone });
      return res.status(200).json({ success: true, data: orders });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  return res
    .status(405)
    .json({ success: false, message: "Method not allowed" });
}
