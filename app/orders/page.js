import OrderTable from "@/components/admin/OrderTable";
import connectDB from "../lib/dbConnect";
import Order from "../models/Order";

export const dynamic = "force-dynamic";

export default async function OrderPage() {
  await connectDB();
  const orders = (await Order.find({}).sort({ createdAt: -1 }).lean()).map(
    (order) => {
      // Also serialize the nested products array
      const serializableProducts = order.products.map((product) => ({
        ...product,
        _id: product._id.toString(),
      }));

      return {
        ...order,
        _id: order._id.toString(),
        createdAt: order.createdAt.toISOString(),
        products: serializableProducts,
      };
    }
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">অর্ডারের তালিকা</h1>
      <OrderTable orders={orders} />
    </div>
  );
}
