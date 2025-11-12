import jwt from "jsonwebtoken";
import Provider from "../models/providerModel.js";

export const protectProvider = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // ✅ Verify JWT
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback_secret"
      );

      // ✅ Attach provider data
      req.provider = await Provider.findById(decoded.id);

      if (!req.provider) {
        return res.status(401).json({ message: "Provider not found" });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};
