import express from "express";
import { createBooking,getMyBookings ,cancelBooking} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/create", protect, createBooking);
router.get("/my",protect, getMyBookings);
router.put("/cancel/:bookingId", protect, cancelBooking);

export default router;
