import express from "express";
import {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// User routes
router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/:id", protect, getBookingById);

// Admin/provider route
router.put("/:id/status", protect, updateBookingStatus);
export default router;
