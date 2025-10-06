import dbConnect from "@/app/lib/dbConnect";
import Video from "@/app/models/Videos";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: true, // normal JSON parse
  },
};

// POST: Save a new video URL
export async function POST(request) {
  await dbConnect();

  try {
    const { url, title } = await request.json();

    if (!url) {
      return NextResponse.json(
        { message: "No video URL provided." },
        { status: 400 }
      );
    }

    // Delete old video (if any)
    await Video.deleteMany({});

    // Save new video
    const newVideo = new Video({ url, title });
    await newVideo.save();

    return NextResponse.json(
      { message: "Video saved successfully!", video: newVideo },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { message: "Server error during upload." },
      { status: 500 }
    );
  }
}

// GET: Fetch the latest video
export async function GET() {
  await dbConnect();

  try {
    const video = await Video.findOne().sort({ createdAt: -1 });
    return NextResponse.json(video || {}, { status: 200 });
  } catch (err) {
    console.error("Fetch Error:", err);
    return NextResponse.json(
      { message: "Server error while fetching videos." },
      { status: 500 }
    );
  }
}
