import express from "express";
import {
  sendProviderOtp,
  verifyProviderOtp,
  registerProvider,
  createService,
  getMyServices,
  toggleServiceStatus,
  getProviderProfile,
  updateProviderProfile,
  deleteService,
} from "../controllers/providerController.js";

import { protectProvider } from "../middleware/protectProvider.js";
import blockBannedProvider from "../middleware/blockBannedProvider.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* ========= AUTH ========= */
router.post("/send-otp", sendProviderOtp);
router.post("/verify-otp", verifyProviderOtp);
router.post("/register", registerProvider);

/* ========= PROVIDER PANEL ========= */

// 🔒 CREATE SERVICE (BLOCK BANNED)
router.post(
  "/create-services",
  protectProvider,        // ✅ MUST BE FIRST
  blockBannedProvider,    // ✅ MUST BE SECOND
  upload.single("image"),
  createService
);

// 🔓 VIEW SERVICES (ALLOWED EVEN IF BANNED)
router.get(
  "/get-services",
  protectProvider,
  getMyServices
);

// 🔒 TOGGLE SERVICE
router.patch(
  "/toggle-service/:id",
  protectProvider,
  blockBannedProvider,
  toggleServiceStatus
);

// 🔒 DELETE SERVICE
router.delete(
  "/delete-service/:id",
  protectProvider,
  blockBannedProvider,
  deleteService
);

/* ========= PROVIDER PROFILE ========= */

// 🔓 PROFILE (ALLOWED EVEN IF BANNED)
router.get(
  "/profile",
  protectProvider,
  getProviderProfile
);

router.put(
  "/profile",
  protectProvider,
  updateProviderProfile
);

export default router;
