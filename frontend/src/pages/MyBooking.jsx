import React, { useEffect, useState } from "react";
import { getMyBookings, cancelBooking } from "../api/api";
import { Calendar, Clock, MapPin, XCircle, CheckCircle, Loader } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // ✅ Fetch user’s bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getMyBookings();
        setBookings(data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // ✅ Cancel Booking (if still pending)
  const handleCancel = async (id) => {
  try {
    setProcessing(true);
    await cancelBooking(id);
    toast.success("Booking cancelled successfully");

    // ✅ Update status locally
    setBookings((prev) =>
      prev.map((b) =>
        b._id === id ? { ...b, status: "cancelled" } : b
      )
    );
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to cancel booking");
  } finally {
    setProcessing(false);
  }
};


  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        <Loader className="animate-spin mr-2" /> Loading bookings...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <Toaster position="top-center" />

      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          My Bookings
        </h2>

        {bookings.length === 0 ? (
          <p className="text-center text-gray-600">
            You have no bookings yet. <br />{" "}
            <span className="text-blue-600 font-medium">Book a service to get started!</span>
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-xl shadow-md border p-4 flex flex-col justify-between hover:shadow-lg transition"
              >
                {/* Service Image */}
                <img
                  src={b.service?.image || "/assets/sample.jpg"}
                  alt={b.service?.name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />

                {/* Service Info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {b.service?.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{b.service?.category}</p>

                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Calendar size={16} /> {b.date}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Clock size={16} /> {b.time}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin size={16} /> {b.address}
                  </div>
                </div>

                {/* Status + Actions */}
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
                      disabled={processing}
                      onClick={() => handleCancel(b._id)}
                      className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm font-medium"
                    >
                      <XCircle size={16} />
                      Cancel
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
