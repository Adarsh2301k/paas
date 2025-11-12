import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true,
      unique: true,
    },

    // Provider details (filled after registration)
    name: { type: String },
    category: { type: String },
    description: { type: String },
    image: { type: String }, // Cloudinary URL
    price: { type: Number },
    experience: { type: Number, default: 1 },
    address: { type: String },
    pincode: { type: String },

    rating: { type: Number, default: 4.5 },

    // Flags
    profileCompleted: { type: Boolean, default: false }, // registration pending?
    verified: { type: Boolean, default: false }, // admin approval
    role: { type: String, enum: ["provider", "admin"], default: "provider" },
  },
  { timestamps: true }
);

export default mongoose.model("Provider", providerSchema);
