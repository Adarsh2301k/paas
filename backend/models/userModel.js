import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [50, "Name cannot exceed 50 characters"],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
  },
  address: {
    type: String,
    trim: true,
    maxlength: [100, "Address too long"],
  },
  pincode: {
    type: String,
    trim: true,
    match: [/^[1-9][0-9]{5}$/, "Invalid pincode format (6 digits required)"],
  },
  mobile: {
    type: String,
    required: [true, "Mobile number is required"],
    unique: true,
    match: [/^[6-9]\d{9}$/, "Invalid Indian mobile number (10 digits required)"],
  },
  avatar: {
  type: String,
  default:
    "",
},

  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
