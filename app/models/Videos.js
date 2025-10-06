// models/Video.js
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String },
  publicId: { type: String },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Video || mongoose.model("Video", videoSchema);
