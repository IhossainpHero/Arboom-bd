import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import Order from "./models/Order";

import Navbar from "@/components/Navbar";
import ProductOrderForm from "@/components/ProductOrderForm";
import connectDB from "../app/lib/dbConnect";
import Product from "./models/Product";

export const dynamic = "force-dynamic";

export default async function Home() {
  await connectDB();
  const products = (await Product.find({}).sort({ createdAt: -1 }).lean()).map(
    (product) => ({
      ...product,
      _id: product._id.toString(),
    })
  );

  const orders = (await Order.find({}).sort({ createdAt: -1 }).lean()).map(
    (order) => {
      // Each product inside the order also needs its _id converted to a string.
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
    <main className="pt-10">
      {" "}
      {/* ✅ Navbar-এর height 16 (h-16) → তাই padding-top: 4rem */}
      <Navbar />
      <HeroSection />
      <ProductGrid products={products} />
      <ProductOrderForm products={products} />
    </main>
  );
}
