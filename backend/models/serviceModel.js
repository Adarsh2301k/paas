import mongoose from "mongoose";

/**
 * Service
 * - Created & managed by Provider
 * - Visible to Users only if active + approved
 */

const serviceSchema = new mongoose.Schema(
  {
    /* ===== BASIC INFO ===== */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
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
        "Electronics Repair",
      ],
    },

    /* ===== SEARCH / INTENT ===== */
    keywords: {
      type: [String], // system + optional provider keywords
      default: [],
    },

    /* ===== PRICING ===== */
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    /* ===== MEDIA ===== */
    image: {
      type: [String], // image URLs (Cloudinary / S3 later)
      default: [],
    },

    /* ===== LOCATION ===== */
    pincode: {
      type: String,
      required: true, // auto-attached from provider profile
      index: true,
    },

    /* ===== OWNERSHIP ===== */
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
      index: true,
    },

    /* ===== STATUS FLAGS ===== */
    isActive: {
      type: Boolean,
      default: true, // provider controlled
    },

    isApproved: {
      type: Boolean,
      default: false, // admin control later
    },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
