import Order from "@/app/models/Order";
import YourOrders from "../../components/YourOrders";
import connectDB from "../../lib/dbConnect";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  await connectDB();
  const orders = await Order.find({}).sort({ createdAt: -1 });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        আপনার অর্ডারের তালিকা
      </h1>
      <YourOrders orders={orders} />
    </div>
  );
}
