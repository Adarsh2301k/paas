import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  mobile: { type: String, required: true },
  otp: { type: String, required: true },
  purpose: { type: String, enum: ["user", "partner"], default: "user" },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: Number(process.env.OTP_EXPIRES_SECONDS) || 180, // auto delete in 2 mins
  },
});

export default mongoose.model("Otp", otpSchema);
