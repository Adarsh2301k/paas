import jwt from "jsonwebtoken";

// ✅ Generate JWT Token for a user
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // payload
    process.env.JWT_SECRET || "fallback_secret", // secret key
    { expiresIn: "30d" } // token expiry
  );
};

export default generateToken;
