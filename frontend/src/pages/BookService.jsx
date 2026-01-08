import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Phone, User } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import {
  getProfile,
  getServiceById,
  createBooking,
  getAvailableSlots,

} from "../api/api";

/* ================= TIME SLOT GENERATOR ================= */
const generateSlots = () => {
  const slots = [];
  let hour = 9;
  let minute = 0;

  while (hour < 21) {
    slots.push(
      `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`
    );
    minute += 15;
    if (minute === 60) {
      minute = 0;
      hour++;
    }
  }
  return slots;
};

const timeSlots = generateSlots();

/* ================= COMPONENT ================= */
const BookService = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);

  /* ================= FETCH PROFILE + SERVICE ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [userData, serviceData] = await Promise.all([
          getProfile(),
          getServiceById(id),
        ]);

        setUser(userData);
        setService(serviceData);
        setAddress(userData.address || "");
      } catch {
        toast.error("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  /* ================= FETCH BOOKED SLOTS ================= */
 useEffect(() => {
  if (!date) return;

  const fetchBookedSlots = async () => {
    try {
      const data = await getAvailableSlots(id, date);
      setBookedSlots(data.bookedSlots || []);
      setSelectedSlot("");
    } catch (err) {
      console.error("Slot fetch error:", err);
      setBookedSlots([]);
    }
  };

  fetchBookedSlots();
}, [date, id]);



  /* ================= BOOKING ================= */
  const handleBooking = async () => {
    if (!date || !selectedSlot || !address.trim()) {
      toast.error("Please select date, time & address");
      return;
    }

    try {
      setProcessing(true);

      await createBooking({
        serviceId: id,
        date,
        time: selectedSlot,
        address,
      });

      toast.success("Booking confirmed 🎉");
      setTimeout(() => navigate("/mybooking"), 1000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Booking failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading…
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Service not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <Toaster />

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow">
        <div className="grid md:grid-cols-2">
          {/* IMAGE */}
          <div className="p-4 bg-gray-100 flex items-center justify-center">
            <img
              src={service.image || "/placeholder.png"}
              alt={service.title}
              className="w-full h-90 object-cover rounded-lg"
            />
          </div>

          {/* DETAILS */}
          <div className="p-4 space-y-3">
            <div>
              <h1 className="text-xl font-semibold">{service.title}</h1>
              <p className="text-xs text-blue-600">{service.category}</p>
              <p className="text-lg font-bold text-green-600">
                ₹{service.price}
              </p>
            </div>

            {/* INFO */}
            <div className="flex flex-wrap gap-3 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <User size={14} /> {user?.name}
              </span>
              <span className="flex items-center gap-1">
                <Phone size={14} /> {user?.mobile}
              </span>
              <span>Provider: {service.provider?.name}</span>
            </div>

            {/* ADDRESS */}
            <div>
              <label className="text-xs font-medium">Service Address</label>
              <textarea
                rows="1"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full mt-1 border rounded-md px-2 py-1 text-sm"
              />
            </div>

            {/* DATE */}
            <div>
              <label className="text-xs font-medium">Select Date</label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar size={14} />
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border rounded-md px-2 py-1 text-sm w-full"
                />
              </div>
            </div>

            {/* TIME SLOTS */}
            <div>
              <label className="text-xs font-medium">Select Time Slot</label>
              <div className="grid grid-cols-5 gap-2 mt-2 max-h-40 overflow-y-auto">
                {timeSlots.map((slot) => {
                  const isBooked = bookedSlots.includes(slot);
                  const isSelected = selectedSlot === slot;

                  return (
                    <button
                      key={slot}
                      disabled={isBooked}
                      onClick={() => setSelectedSlot(slot)}
                      className={`border rounded-md py-1 text-xs transition ${
                        isBooked
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : isSelected
                          ? "bg-blue-600 text-white"
                          : "hover:border-blue-400"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>

              {/* LEGEND */}
              <div className="flex gap-4 mt-2 text-xs text-gray-500">
                <span>⬜ Available</span>
                <span>🟦 Selected</span>
                <span>⬛ Booked</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleBooking}
              disabled={processing}
              className={`w-full py-2 rounded-md text-white text-sm font-semibold ${
                processing
                  ? "bg-blue-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {processing ? "Processing…" : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookService;
