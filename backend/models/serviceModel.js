import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Electrician",
        "Plumber",
        "AC Repair",
        "Cleaning",
        "Carpenter",
        "Electronics Repair"
      ],
    },

    keywords: {
      type: [String], // 🔑 search ke liye
      default: [],
    },

    price: {
      type: Number,
      required: true,
    },

    pincode: {
      type: String,
      required: true,
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: false, // abhi NULL allow
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
