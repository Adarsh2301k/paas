import express from "express";
import {
  getProviders,
  getProviderDetails,
  
  sendPartnerOtp,
  verifyPartnerOtp,
  verifyPartnerLogin,
} from "../controllers/providerController.js";

const router = express.Router();

// User-side routes
router.get("/", getProviders);
router.get("/:id", getProviderDetails);

// Partner (provider) auth routes
router.post("/send-otp", sendPartnerOtp);
router.post("/verify-otp", verifyPartnerOtp);
router.post("/login-otp", verifyPartnerLogin);

// Admin seed (dev only)
// router.post("/create", createProvider);

export default router;
