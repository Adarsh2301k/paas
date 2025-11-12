import express from "express";
import {
  sendProviderOtp,
  verifyProviderOtp,
  registerProvider,
  getProviderProfile,
  updateProviderProfile,
  getProviderBookings,
  completeProviderBooking,
  getProviderDashboardStats
} from "../controllers/providerController.js";

import { protectProvider } from "../middleware/providerMiddleware.js";

const router = express.Router();

// ✅ OTP Login Flow
router.post("/send-otp", sendProviderOtp);
router.post("/verify-otp", verifyProviderOtp);

// ✅ Registration after OTP (ONLY for new providers)
router.post("/register", protectProvider, registerProvider);

// ✅ Profile Routes
router.get("/me", protectProvider, getProviderProfile);
router.put("/me", protectProvider, updateProviderProfile);

// ✅ Booking Routes
router.get("/bookings", protectProvider, getProviderBookings);
router.put("/bookings/:id/complete", protectProvider, completeProviderBooking);

// ✅ Dashboard Stats
router.get("/dashboard-stats", protectProvider, getProviderDashboardStats);

export default router;
