import CartModal from "@/components/cartModel";
import Navbar from "@/components/Navbar";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "./context/context/CartContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "arBoom bd",
  icons: {
    icon: "/public/images/logo.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <CartProvider>
          <Navbar />
          {children}
          <CartModal /> {/* ✅ গ্লোবালি রাখা হয়েছে */}
        </CartProvider>
      </body>
    </html>
  );
}
