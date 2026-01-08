import jwt from "jsonwebtoken";
import validator from "validator";
import Provider from "../models/providerModel.js";
import Otp from "../models/otpModel.js";
import Service from "../models/serviceModel.js";


const blockIfBanned = (provider, res) => {
  if (provider.isBanned) {
    res.status(403).json({
      message: "You are banned by admin. Action not allowed.",
    });
    return true;
  }
  return false;
};

/* ================= SEND OTP ================= */
export const sendProviderOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (
      !mobile ||
      !validator.isMobilePhone(mobile, "en-IN", { strictMode: false })
    ) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ mobile, purpose: "provider" });

    await Otp.create({
      mobile,
      otp,
      purpose: "provider",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    console.log("PROVIDER OTP:", otp); // dev only

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("SEND PROVIDER OTP ERROR:", err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

/* ================= VERIFY OTP ================= */
export const verifyProviderOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (
      !mobile ||
      !otp ||
      !validator.isMobilePhone(mobile, "en-IN", { strictMode: false })
    ) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const record = await Otp.findOne({
      mobile,
      otp: otp.toString(),
      purpose: "provider",
      expiresAt: { $gt: new Date() },
    });

    if (!record) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP used → delete
    await Otp.deleteMany({ mobile, purpose: "provider" });

    const provider = await Provider.findOne({ mobile });

    // 🔴 IMPORTANT FIX
    if (!provider) {
      return res.status(200).json({
        needsRegistration: true,
        mobile, // frontend can prefill
      });
    }

    const isAdmin = mobile === process.env.ADMIN_MOBILE;

    const token = jwt.sign(
      {
        id: provider._id,
        role: "provider",
        isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      token,
      isAdmin,
    });
  } catch (err) {
    console.error("VERIFY PROVIDER OTP ERROR:", err);
    return res.status(500).json({ message: "OTP verification failed" });
  }
};

/* ================= REGISTER PROVIDER ================= */
export const registerProvider = async (req, res) => {
  try {
    const { name, mobile, pincode, categories } = req.body;

    if (
      !name ||
      !mobile ||
      !pincode ||
      !validator.isMobilePhone(mobile, "en-IN", { strictMode: false })
    ) {
      return res.status(400).json({ message: "Invalid fields" });
    }

    if (!validator.isPostalCode(pincode, "IN")) {
      return res.status(400).json({ message: "Invalid pincode" });
    }

    const exists = await Provider.findOne({ mobile });
    if (exists) {
      return res.status(400).json({ message: "Provider already exists" });
    }

    const provider = await Provider.create({
      name,
      mobile,
      pincode,
      categories,
    });

    const token = jwt.sign(
      { id: provider._id, role: "provider" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({ token });
  } catch (err) {
    console.error("REGISTER PROVIDER ERROR:", err);
    return res.status(500).json({ message: "Provider registration failed" });
  }
};

/* ================= CREATE SERVICE ================= */
export const createService = async (req, res) => {
  try {
    if (blockIfBanned(req.provider, res)) return;

    const { title, category, price, description } = req.body;

    if (!title || !category || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const imageUrl = req.file ? req.file.path : "";

    const service = await Service.create({
      title,
      category,
      price,
      description,
      image: imageUrl,
      pincode: req.provider.pincode,
      provider: req.provider._id,
      isActive: true,
      isApproved: false,
    });

    return res.status(201).json(service);
  } catch (err) {
    console.error("CREATE SERVICE ERROR:", err);
    return res.status(500).json({ message: "Failed to create service" });
  }
};


/* ================= GET MY SERVICES ================= */
export const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({
      provider: req.provider._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json(services);
  } catch (err) {
    console.error("GET MY SERVICES ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch services" });
  }
};

/* ================= TOGGLE SERVICE STATUS ================= */
export const toggleServiceStatus = async (req, res) => {
  try {
    if (blockIfBanned(req.provider, res)) return;

    const { id } = req.params;

    const service = await Service.findOne({
      _id: id,
      provider: req.provider._id,
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.isActive = !service.isActive;
    await service.save();

    return res.status(200).json(service);
  } catch (err) {
    console.error("TOGGLE SERVICE ERROR:", err);
    return res.status(500).json({ message: "Failed to update service" });
  }
};


/* ================= DELETE SERVICE ================= */
export const deleteService = async (req, res) => {
  try {
    if (blockIfBanned(req.provider, res)) return;

    const { id } = req.params;

    const service = await Service.findOneAndDelete({
      _id: id,
      provider: req.provider._id,
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json({ message: "Service deleted" });
  } catch (err) {
    console.error("DELETE SERVICE ERROR:", err);
    return res.status(500).json({ message: "Failed to delete service" });
  }
};


/* ================= GET PROVIDER PROFILE ================= */

export const getProviderProfile = async (req, res) => {
  try {
    if (!req.provider) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const provider = await Provider.findById(req.provider._id);

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    return res.status(200).json({
      name: provider.name,
      mobile: provider.mobile,
      pincode: provider.pincode,
      categories: provider.categories,
      isBanned: provider.isBanned,
      isAdmin: provider.isAdmin || false,
    });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
};


/* ================= UPDATE PROVIDER PROFILE ================= */
export const updateProviderProfile = async (req, res) => {
  try {
    if (!req.provider) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const provider = await Provider.findById(req.provider._id);

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const { name, pincode, categories } = req.body;

    if (name) provider.name = name;
    if (pincode) provider.pincode = pincode;
    if (categories) provider.categories = categories;

    await provider.save();

    res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

