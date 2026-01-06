import React, { useEffect, useState } from "react";
import { getMyBookings, cancelBooking } from "../api/api";
import {
  Calendar,
  Clock,
  MapPin,
  XCircle,
  Loader,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // 🔹 Fetch user bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getMyBookings();

        // ✅ backend sends { bookings }
        setBookings(data?.bookings || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // 🔹 Cancel booking
  const handleCancel = async (bookingId) => {
    try {
      setProcessingId(bookingId);
      await cancelBooking(bookingId);

      toast.success("Booking cancelled");

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId
            ? { ...b, status: "cancelled" }
            : b
        )
      );
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to cancel booking"
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        <Loader className="animate-spin mr-2" />
        Loading bookings…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <Toaster position="top-center" />

      <div className="max-w-6xl mx-auto">
       

        {bookings.length === 0 ? (
          <p className="text-center text-gray-600">
            You have no bookings yet. <br />
            <span className="text-blue-600 font-medium">
              Book a service to get started!
            </span>
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-xl border shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition"
              >
                {/* SERVICE IMAGE */}
                <img
                  src={b.service?.image || "/placeholder.png"}
                  alt={b.service?.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />

                {/* SERVICE INFO */}
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {b.service?.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {b.service?.category}
                  </p>

                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Calendar size={14} /> {b.date}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Clock size={14} /> {b.time}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin size={14} /> {b.address}
                  </div>
                </div>

                {/* STATUS + ACTION */}
                <div className="flex justify-between items-center mt-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      b.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : b.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>

                  {b.status === "pending" && (
                    <button
                      disabled={processingId === b._id}
                      onClick={() => handleCancel(b._id)}
                      className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm font-medium disabled:opacity-50"
                    >
                      <XCircle size={16} />
                      {processingId === b._id ? "Cancelling…" : "Cancel"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooking;
