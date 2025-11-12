import Provider from "../models/providerModel.js";
import Otp from "../models/otpModel.js";
import Booking from "../models/bookingModel.js";
import jwt from "jsonwebtoken";

// ✅ Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "30d",
  });
};

// =================================================================
// ✅ 1. SEND OTP
// =================================================================
export const sendProviderOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    await Otp.create({ mobile, otp });

    console.log("🔹 Provider OTP:", otp);

    res.json({ message: "OTP sent", otp }); // remove otp in production
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =================================================================
// ✅ 2. VERIFY OTP → LOGIN or TEMP REGISTER
// =================================================================
export const verifyProviderOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    const checkOtp = await Otp.findOne({ mobile, otp });
    if (!checkOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    let provider = await Provider.findOne({ mobile });

    // ✅ If provider does NOT exist → create temp account
    let exists = true;

    if (!provider) {
      exists = false;
      provider = await Provider.create({
        mobile,
        profileCompleted: false,
        verified: false,
      });
    }

    const token = generateToken(provider._id);

    res.json({
      exists,
      token,
      provider,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =================================================================
// ✅ 3. REGISTER PROVIDER (after OTP)
// =================================================================
export const registerProvider = async (req, res) => {
  try {
    const providerId = req.provider._id;

    const updated = await Provider.findByIdAndUpdate(
      providerId,
      {
        ...req.body,
        profileCompleted: true,
        verified: false, // admin will verify later
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =================================================================
// ✅ 4. GET PROVIDER PROFILE
// =================================================================
export const getProviderProfile = async (req, res) => {
  try {
    const provider = await Provider.findById(req.provider._id);
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =================================================================
// ✅ 5. UPDATE PROVIDER PROFILE
// =================================================================
export const updateProviderProfile = async (req, res) => {
  try {
    const updated = await Provider.findByIdAndUpdate(
      req.provider._id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =================================================================
// ✅ 6. GET PROVIDER BOOKINGS
// =================================================================
export const getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.provider._id })
      .populate("user", "name mobile")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =================================================================
// ✅ 7. COMPLETE A BOOKING
// =================================================================
export const completeProviderBooking = async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =================================================================
// ✅ 8. PROVIDER DASHBOARD STATS
// =================================================================
export const getProviderDashboardStats = async (req, res) => {
  try {
    const providerId = req.provider._id;

    const totalBookings = await Booking.countDocuments({ provider: providerId });
    const completed = await Booking.countDocuments({
      provider: providerId,
      status: "completed",
    });
    const pending = await Booking.countDocuments({
      provider: providerId,
      status: "pending",
    });

    res.json({
      totalBookings,
      completed,
      pending,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =================================================================
// ✅ 9. USER-SIDE METHODS (already existed)
// =================================================================
export const getProviders = async (req, res) => {
  try {
    const providers = await Provider.find({ verified: true });
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProviderDetails = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
