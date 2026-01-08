import validator from "validator";
import User from "../models/userModel.js";
import Otp from "../models/otpModel.js";
import generateToken from "../utils/generateToken.js";

/**
 * 📩 SEND OTP (for Login or Register)
 * - Validates mobile and email (for register)
 * - Prevents sending OTP for invalid cases
 */
export const sendOtp = async (req, res) => {
  try {
    const { mobile, action, email } = req.body;
    // action = "login" | "register"

    // 🔹 Validate mobile
    if (!validator.isMobilePhone(mobile, "en-IN")) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }

    // 🔹 Validate email only for registration
    if (action === "register") {
      if (!validator.isEmail(email || "")) {
        return res
          .status(400)
          .json({ message: "Invalid or missing email address" });
      }
    }

    const user = await User.findOne({ mobile });

    // 🔹 If login but user doesn’t exist
    if (action === "login" && !user) {
      return res
        .status(404)
        .json({ message: "User not registered. Please register first." });
    }

    // 🔹 If register but user already exists
    if (action === "register" && user) {
      return res
        .status(400)
        .json({ message: "User already registered. Please login." });
    }

    // 🔹 Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`🔹 OTP for ${mobile}: ${otp}`);

    // 🔹 Remove old OTPs for this user
    await Otp.deleteMany({ mobile, purpose: "user" });

    // 🔹 Save OTP
    await Otp.create({
      mobile,
      otp,
      purpose: "user", // 🔐 always user here
      expiresAt: new Date(Date.now() + 3 * 60 * 1000), // 3 min
    });

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};


/**
 * 🔐 VERIFY LOGIN OTP (existing users only)
 */
export const verifyLoginOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp)
      return res.status(400).json({ message: "Mobile and OTP are required" });

    if (!validator.isMobilePhone(mobile, "en-IN")) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }

    const otpRecord = await Otp.findOne({ mobile }).sort({ createdAt: -1 });
    if (!otpRecord) return res.status(400).json({ message: "OTP not found" });
    if (otpRecord.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    const user = await User.findOne({ mobile });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not registered. Please register first." });

    const token = generateToken(user._id);
    return res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

/**
 * 🧾 VERIFY REGISTER OTP (new users only)
 */
export const verifyRegisterOtp = async (req, res) => {
  try {
    const { name, email, address, pincode, mobile, otp } = req.body;

    // 🔹 Basic field check
    if (!name || !email || !address || !pincode || !mobile || !otp)
      return res.status(400).json({ message: "All fields are required" });

    // 🔹 Validate all fields
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!validator.isMobilePhone(mobile, "en-IN")) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }
    if (!validator.isPostalCode(pincode, "IN")) {
      return res.status(400).json({ message: "Invalid pincode" });
    }

    // 🔹 Check OTP validity
    const otpRecord = await Otp.findOne({ mobile }).sort({ createdAt: -1 });
    if (!otpRecord) return res.status(400).json({ message: "OTP not found" });
    if (otpRecord.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    // 🔹 Check if user already exists
    const existing = await User.findOne({ mobile });
    if (existing)
      return res
        .status(400)
        .json({ message: "User already registered. Please login." });

    // 🔹 Create new user
    const user = await User.create({
      name,
      email,
      address,
      pincode,
      mobile,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      message: "Registration successful",
      user,
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  } 
};

/**
 * 👤 GET USER PROFILE
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load profile" });
  }
};

/**
 * ✏️ UPDATE PROFILE
 */

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, address, pincode } = req.body;

    // 🔹 Validate email
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // 🔹 Validate pincode
    if (pincode && !validator.isPostalCode(pincode, "IN")) {
      return res.status(400).json({ message: "Invalid pincode" });
    }

    // 🔹 Update text fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.address = address || user.address;
    user.pincode = pincode || user.pincode;

    // 🔹 If a file was uploaded (via multer + Cloudinary)
    if (req.file && req.file.path) {
      user.avatar = req.file.path;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
