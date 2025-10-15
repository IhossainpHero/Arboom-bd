import connectDB from "@/app/lib/dbConnect";
import Order from "@/app/models/Order";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "PATCH") {
    try {
      const { status } = req.body;
      const order = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      if (!order)
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      return res.status(200).json({ success: true, data: order });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  return res
    .status(405)
    .json({ success: false, message: "Method not allowed" });
}
