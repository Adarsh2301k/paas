import express from "express";
import {
  sendOtp,
  verifyLoginOtp,
  verifyRegisterOtp,
  getProfile,
  updateProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ✅ Auth Flow
router.post("/send-otp", sendOtp);
router.post("/verify-login", verifyLoginOtp);
router.post("/verify-register", verifyRegisterOtp);

// ✅ Profile
router.get("/profile", protect, getProfile);
router.put("/profile", protect, upload.single("avatar"), updateProfile);

export default router;
