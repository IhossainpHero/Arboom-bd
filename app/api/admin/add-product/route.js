import dbConnect from "@/app/lib/dbConnect";
import Product from "@/app/models/Product";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Configure Cloudinary with your environment variables from .env.local
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to read a Web Stream into a buffer
async function streamToBuffer(readableStream) {
  const reader = readableStream.getReader();
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

// GET handler to fetch all products
export async function GET() {
  await dbConnect();
  try {
    const products = await Product.find({});
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products from database:", error);
    return NextResponse.json(
      {
        success: false,
        message: "পণ্য লোড করতে ব্যর্থ হয়েছে।",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST handler to add a new product
export async function POST(req) {
  await dbConnect();
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const offerPrice = formData.get("offerPrice");
    const regularPrice = formData.get("regularPrice");
    const details = formData.get("details");
    const imageFile = formData.get("image");

    if (!imageFile) {
      return NextResponse.json(
        { success: false, message: "ছবি আপলোড করতে ব্যর্থ হয়েছে।" },
        { status: 400 }
      );
    }

    // Convert file stream to buffer using the updated helper
    const buffer = await streamToBuffer(imageFile.stream());

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:${imageFile.type};base64,${buffer.toString("base64")}`,
      {
        upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      }
    );

    // Create a new product with the Cloudinary URL and ID
    const newProduct = new Product({
      name,
      offerPrice: parseFloat(offerPrice),
      regularPrice: parseFloat(regularPrice),
      details,
      imageURL: result.secure_url,
      imageID: result.public_id,
    });
    await newProduct.save();

    return NextResponse.json(
      {
        success: true,
        message: "পণ্য সফলভাবে যোগ করা হয়েছে।",
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      {
        success: false,
        message: "পণ্য যোগ করতে ব্যর্থ হয়েছে।",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a product by ID
export async function DELETE(req) {
  await dbConnect();
  const id = req.nextUrl.searchParams.get("id");

  if (!id || id === "null") {
    return NextResponse.json(
      { success: false, message: "পণ্য আইডি দেওয়া হয়নি।" },
      { status: 400 }
    );
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "এই আইডির কোনো পণ্য পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    // Also delete the image from Cloudinary
    if (product.imageID) {
      await cloudinary.uploader.destroy(product.imageID);
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "পণ্য সফলভাবে মুছে ফেলা হয়েছে।",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      {
        success: false,
        message: "পণ্য মুছে ফেলতে ব্যর্থ হয়েছে।",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
