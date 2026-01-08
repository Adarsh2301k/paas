import express from "express";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAvailableSlots,
} from "../controllers/bookingController.js";
import  {protectProvider}  from "../middleware/protectProvider.js";
import  blockBannedProvider from "../middleware/blockBannedProvider.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProviderBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js";

const router = express.Router();

/* ===== SLOTS ===== */
router.get("/available-slots", getAvailableSlots);

/* ===== BOOKINGS ===== */
router.post("/create", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.put("/cancel/:bookingId", protect, cancelBooking);

// provider booking managaement s 

router.get(
  "/provider",
  protectProvider,
  blockBannedProvider,
  getProviderBookings
);

// Accept / Reject / Complete booking
router.put(
  "/provider/:bookingId/status",
  protectProvider,
  blockBannedProvider,
  updateBookingStatus
);

export default router;
