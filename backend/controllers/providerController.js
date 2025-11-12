import Provider from "../models/providerModel.js";
import Otp from "../models/otpModel.js";
import generateToken from "../utils/generateToken.js";
import validator from "validator";

// ====================================================
// 📋 FETCH PROVIDERS (for users)
// ====================================================
export const getProviders = async (req, res) => {
  try {
    const { category, pincode } = req.query;
    const filters = {};
    if (category) filters.category = category;
    if (pincode) filters.pincode = pincode;

    const providers = await Provider.find(filters);
    res.status(200).json(providers);
  } catch (error) {
    console.error("Error fetching providers:", error);
    res.status(500).json({ message: "Failed to load providers" });
  }
};

// ====================================================
// 📄 GET SINGLE PROVIDER DETAILS
// ====================================================
export const getProviderDetails = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });

    res.status(200).json(provider);
  } catch (error) {
    console.error("Error fetching provider details:", error);
    res.status(500).json({ message: "Failed to load provider details" });
  }
};

// ====================================================
// 🧑‍💼 TEMP ADMIN SEED (for dev only)
// ====================================================
export const createProvider = async (req, res) => {
  try {
    const provider = await Provider.create(req.body);
    res.status(201).json(provider);
  } catch (error) {
    console.error("Error creating provider:", error);
    res.status(500).json({ message: "Failed to add provider" });
  }
};

// ====================================================
// 🔐 OTP AUTH (Registration / Login for Partners)
// ====================================================

// 📩 STEP 1: Send OTP (Register Flow)
export const sendPartnerOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    // ✅ Validation
    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }

    const existing = await Provider.findOne({ mobile });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Provider already registered. Please login." });
    }

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.create({ mobile, otp, purpose: "partner" });

    console.log(`📲 Partner OTP sent to ${mobile}: ${otp}`);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending partner OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ✅ STEP 2: Verify OTP and Register Provider
export const verifyPartnerOtp = async (req, res) => {
  try {
    const { name, email, mobile, otp, category, address, pincode } = req.body;

    // ✅ Field validation
    if (!name || !email || !mobile || !otp || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (pincode && !validator.isPostalCode(pincode, "IN")) {
      return res.status(400).json({ message: "Invalid pincode format" });
    }

    // ✅ Validate OTP
    const otpRecord = await Otp.findOne({ mobile, purpose: "partner" }).sort({
      createdAt: -1,
    });
    if (!otpRecord) return res.status(400).json({ message: "OTP not found" });

    const now = new Date();
    const diff = (now - otpRecord.createdAt) / 1000;
    if (diff > 600) return res.status(400).json({ message: "OTP expired" });

    if (otpRecord.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    // ✅ Check if already exists
    const existing = await Provider.findOne({ mobile });
    if (existing)
      return res
        .status(400)
        .json({ message: "Provider already registered. Please login." });

    // ✅ Register new provider
    const provider = await Provider.create({
      name,
      email,
      mobile,
      category,
      address,
      pincode,
      verified: false, // Will be verified by admin
    });

    const token = generateToken(provider._id);

    res.status(201).json({
      message:
        "Registration successful! Await admin verification before login.",
      provider,
      token,
    });
  } catch (error) {
    console.error("Error verifying partner OTP:", error);
    res.status(500).json({ message: "Server error during verification" });
  }
};

// ✅ STEP 3: Login OTP (for verified providers)
// ✅ Verify OTP for existing partner (login)
export const verifyPartnerLogin = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp)
      return res.status(400).json({ message: "Mobile and OTP required" });

    const otpRecord = await Otp.findOne({ mobile, purpose: "partner" }).sort({
      createdAt: -1,
    });

    if (!otpRecord)
      return res.status(400).json({ message: "OTP not found" });

    // Check expiry (10 min)
    const now = new Date();
    const diff = (now - otpRecord.createdAt) / 1000;
    if (diff > 600)
      return res.status(400).json({ message: "OTP expired" });

    if (otpRecord.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    const provider = await Provider.findOne({ mobile });
    if (!provider)
      return res
        .status(404)
        .json({ message: "No account found for this number" });

    const token = generateToken(provider._id);
    res.status(200).json({
      message: "Login successful",
      provider,
      token,
    });
  } catch (error) {
    console.error("Error verifying partner login OTP:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
