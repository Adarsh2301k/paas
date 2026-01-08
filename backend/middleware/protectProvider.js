import jwt from "jsonwebtoken";
import Provider from "../models/providerModel.js";

export const protectProvider = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const provider = await Provider.findById(decoded.id).lean();

    if (!provider) {
      return res.status(401).json({ message: "Provider not found" });
    }

    // ✅ attach clean provider doc
    req.provider = provider;

    // ✅ attach admin flag SEPARATELY
    req.isAdmin = decoded.isAdmin === true;

    next();
  } catch (err) {
    console.error("PROVIDER AUTH ERROR:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
