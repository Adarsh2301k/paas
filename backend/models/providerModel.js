import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    pincode: {
      type: String,
      required: true,
    },
    categories: [
      {
        type: String, // e.g. Plumber, Electrician
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    // providerModel.js
isAdmin: {
  type: Boolean,
  default: false,
},
isBanned: {
  type: Boolean,
  default: false,
},

  },
  { timestamps: true }
);

export default mongoose.model("Provider", providerSchema);
