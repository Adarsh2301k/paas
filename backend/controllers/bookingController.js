import Booking from "../models/bookingModel.js";
import Service from "../models/serviceModel.js";

/* ================= SLOT UTILS ================= */

// Generate 15-min slots between 09:00–21:00
const generateSlots = () => {
  const slots = [];
  let hour = 9;
  let minute = 0;

  while (hour < 21) {
    const h = hour.toString().padStart(2, "0");
    const m = minute.toString().padStart(2, "0");
    slots.push(`${h}:${m}`);

    minute += 15;
    if (minute === 60) {
      minute = 0;
      hour++;
    }
  }
  return slots;
};

/* ================= AVAILABLE SLOTS ================= */
export const getAvailableSlots = async (req, res) => {
  try {
    const { serviceId, date } = req.query;

    if (!serviceId || !date) {
      return res.status(400).json({ message: "serviceId and date required" });
    }

    // Get already booked slots
    const bookings = await Booking.find({
      service: serviceId,
      date,
      status: { $ne: "cancelled" },
    }).select("time");

    const bookedSlots = bookings.map((b) => b.time);

    const allSlots = generateSlots();

    const availableSlots = allSlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    return res.status(200).json({
      date,
      availableSlots,
      bookedSlots,
    });
  } catch (err) {
    console.error("SLOT ERROR:", err);
    res.status(500).json({ message: "Failed to fetch slots" });
  }
};

/* ================= CREATE BOOKING ================= */
export const createBooking = async (req, res) => {
  try {
    const { serviceId, address, date, time } = req.body;

    if (!serviceId || !address || !date || !time) {
      return res.status(400).json({ message: "All fields required" });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // ❌ Prevent double booking
    const exists = await Booking.findOne({
      service: serviceId,
      date,
      time,
      status: { $ne: "cancelled" },
    });

    if (exists) {
      return res.status(409).json({
        message: "This time slot is already booked",
      });
    }

    const booking = await Booking.create({
      user: req.user._id,
      service: serviceId,
      address,
      date,
      time,
      status: "pending",
    });

    return res.status(201).json({
      message: "Booking created",
      booking,
    });
  } catch (err) {
    console.error("BOOKING ERROR:", err);
    res.status(500).json({ message: "Booking failed" });
  }
};

/* ================= USER BOOKINGS ================= */
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: "service",
        select: "title category price image provider",
        populate: {
          path: "provider",
          select: "name mobile",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get my bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};


/* ================= CANCEL ================= */
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Cannot cancel after acceptance" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Cancel failed" });
  }
};



// provider pannel booking managements 
export const getProviderBookings = async (req, res) => {
  try {
    // 1️⃣ Get provider services
    const services = await Service.find({ provider: req.provider._id }).select(
      "_id"
    );

    const serviceIds = services.map((s) => s._id);

    // 2️⃣ Get bookings for those services
    const bookings = await Booking.find({
      service: { $in: serviceIds },
    })
      .populate("user", "name mobile")
      .populate("service", "title price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (err) {
    console.error("Provider bookings error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch provider bookings",
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    

    const { bookingId } = req.params;
    const { status } = req.body;

    const allowedStatus = ["accepted", "rejected", "completed"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    const booking = await Booking.findById(bookingId).populate("service");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 1️⃣ Check provider ownership
    if (
      booking.service.provider.toString() !==
      req.provider._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 2️⃣ Status transition rules
    if (booking.status === "pending") {
      if (!["accepted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid action" });
      }
    }

    if (booking.status === "accepted") {
      if (status !== "completed") {
        return res.status(400).json({ message: "Invalid action" });
      }
    }

    if (["rejected", "completed", "cancelled"].includes(booking.status)) {
      return res
        .status(400)
        .json({ message: "Booking cannot be updated" });
    }

    // 3️⃣ Update
    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking status updated",
      booking,
    });
  } catch (err) {
    console.error("Update booking status error:", err);
    res.status(500).json({ message: "Failed to update booking" });
  }
};
