import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true }, // শুধু YouTube link রাখবো
  },
  { timestamps: true }
);

export default mongoose.models.Video || mongoose.model("Video", videoSchema);
