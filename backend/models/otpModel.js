import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    mobile: { type: String, required: true },
    otp: { type: String, required: true },

    purpose: {
      type: String,
      enum: ["user", "provider"],
      required: true,
      default: "user",
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: "180s" }, // auto delete after 3 min
    },
  },
  { timestamps: true }
);

export default mongoose.model("Otp", otpSchema);
