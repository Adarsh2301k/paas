import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  price: { type: Number, required: true },
  rating: { type: Number, default: 4.5 },
  experience: { type: Number, default: 1 },
  verified: { type: Boolean, default: false },
  address: { type: String },
  pincode: { type: String },
});

export default mongoose.model("Provider", providerSchema);
