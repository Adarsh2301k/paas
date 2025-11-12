import Booking from "../models/bookingModel.js";
import Provider from "../models/providerModel.js"; // your service model
import generateOtp from "../utils/generateOtp.js"; // optional helper

// 📦 CREATE BOOKING
export const createBooking = async (req, res) => {
  try {
    const { serviceId, date, time, address } = req.body;

    if (!serviceId || !date || !time || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Verify service exists
    const service = await Provider.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // ✅ Generate OTP for verification (can be used later)
    const otp = generateOtp();

    // ✅ Create booking
    const booking = await Booking.create({
      user: req.user._id,
      service: service._id,
      date,
      time,
      address,
      otp,
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ message: "Server error while creating booking" });
  }
};

// 🧾 GET MY BOOKINGS (user-specific)
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("service", "name category price image verified")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ message: "Failed to load bookings" });
  }
};

// ✅ GET SINGLE BOOKING (optional)
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("service")
      .populate("user", "name mobile email address");

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error loading booking" });
  }
};

// 🧩 UPDATE BOOKING STATUS (for provider/admin)
// 🧩 UPDATE BOOKING STATUS (for provider/admin/user)
export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const newStatus = req.body.status;

    // ✅ If user tries to cancel
    if (newStatus === "cancelled") {
      if (booking.status !== "pending") {
        return res
          .status(400)
          .json({ message: "Only pending bookings can be cancelled" });
      }

      // Ensure the booking belongs to the logged-in user
      if (booking.user.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to cancel this booking" });
      }

      booking.status = "cancelled";
      await booking.save();
      return res.status(200).json({ message: "Booking cancelled successfully", booking });
    }

    // ✅ Otherwise handle normal provider/admin status updates
    booking.status = newStatus || booking.status;
    await booking.save();

    res.status(200).json({ message: "Status updated successfully", booking });
  } catch (error) {
    console.error("Booking status update error:", error);
    res.status(500).json({ message: "Failed to update booking" });
  }
};
