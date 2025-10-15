import dbConnect from "@/app/lib/dbConnect";
import Product from "@/app/models/Product";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: convert stream to buffer
async function streamToBuffer(readableStream) {
  const chunks = [];
  for await (const chunk of readableStream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

// GET: fetch all products
export async function GET() {
  await dbConnect();
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
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

// POST: add new product
export async function POST(req) {
  await dbConnect();
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const offerPrice = parseFloat(formData.get("offerPrice") || 0);
    const regularPrice = parseFloat(formData.get("regularPrice") || 0);
    const details = formData.get("details");
    const imageFile = formData.get("image");

    if (!imageFile) {
      return NextResponse.json(
        { success: false, message: "ছবি নির্বাচন করুন।" },
        { status: 400 }
      );
    }

    // convert to buffer
    const buffer = await streamToBuffer(imageFile.stream());

    // temporary file path
    const tempPath = path.join(process.cwd(), "temp_upload");
    if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath);
    const tempFilePath = path.join(tempPath, imageFile.name);
    fs.writeFileSync(tempFilePath, buffer);

    // upload to Cloudinary with resize + webp
    let uploadResult;
    try {
      uploadResult = await cloudinary.uploader.upload(tempFilePath, {
        folder: "arboom_products",
        transformation: [
          { width: 750, height: 750, crop: "limit" },
          { fetch_format: "webp", quality: "auto:good" },
        ],
      });
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return NextResponse.json(
        {
          success: false,
          message: "ছবি আপলোড করতে ব্যর্থ হয়েছে।",
          error: err.message,
        },
        { status: 500 }
      );
    } finally {
      fs.unlinkSync(tempFilePath); // remove temp file
    }

    // create product in DB
    const newProduct = await Product.create({
      name,
      offerPrice,
      regularPrice,
      details,
      imageURL: uploadResult.secure_url,
      imageID: uploadResult.public_id,
    });

    return NextResponse.json(
      { success: true, message: "পণ্য যোগ হয়েছে।", product: newProduct },
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

// DELETE: remove product by ID
export async function DELETE(req) {
  await dbConnect();
  const id = req.nextUrl.searchParams.get("id");
  if (!id)
    return NextResponse.json(
      { success: false, message: "পণ্য আইডি দেওয়া হয়নি।" },
      { status: 400 }
    );

  try {
    const product = await Product.findById(id);
    if (!product)
      return NextResponse.json(
        { success: false, message: "পণ্য পাওয়া যায়নি।" },
        { status: 404 }
      );

    if (product.imageID) await cloudinary.uploader.destroy(product.imageID);
    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "পণ্য মুছে ফেলা হয়েছে।",
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
