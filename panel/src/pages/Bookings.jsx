import React, { useEffect, useMemo, useState } from "react";
import {
  getProviderBookings,
  updateBookingStatus,
} from "../api/bookingApi";
import toast from "react-hot-toast";

const STATUS_ORDER = {
  accepted: 1,
  pending: 2,
  completed: 3,
  rejected: 4,
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [filter, setFilter] = useState("all"); // today | week | all

  /* ================= FETCH BOOKINGS ================= */
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getProviderBookings();
        setBookings(data.bookings || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  /* ================= SORT + FILTER (CORRECT ORDER) ================= */
  const visibleBookings = useMemo(() => {
    const now = new Date();
now.setHours(0, 0, 0, 0);


    // 1️⃣ SORT FIRST (GLOBAL PRIORITY)
    const sorted = [...bookings].sort((a, b) => {
      const orderA = STATUS_ORDER[a.status] ?? 99;
      const orderB = STATUS_ORDER[b.status] ?? 99;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      const aTime = new Date(`${a.date}T${a.time}`).getTime();
      const bTime = new Date(`${b.date}T${b.time}`).getTime();
      return aTime - bTime;
    });

    // 2️⃣ THEN FILTER (VISIBILITY ONLY)
    return sorted.filter((b) => {
      if (filter === "all") return true;

      const bookingDate = new Date(`${b.date}T00:00:00`);

      if (filter === "today") {
        return bookingDate.toDateString() === now.toDateString();
      }

      if (filter === "week") {
        const diff =
          (bookingDate - now) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 7;
      }

      return true;
    });
  }, [bookings, filter]);

  /* ================= UPDATE STATUS ================= */
  const handleStatusUpdate = async (bookingId, status) => {
    try {
      setProcessingId(bookingId);
      await updateBookingStatus(bookingId, status);

      toast.success(`Booking ${status}`);

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status } : b
        )
      );
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Action failed"
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-gray-600">
        Loading bookings…
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Bookings</h1>

        {/* FILTERS */}
        <div className="flex gap-2">
          {["today", "week", "all"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs rounded-md border ${
                filter === f
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {f === "today"
                ? "Today"
                : f === "week"
                ? "This Week"
                : "All"}
            </button>
          ))}
        </div>
      </div>

      {visibleBookings.length === 0 ? (
        <p className="text-sm text-gray-500">
          No bookings found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleBookings.map((b) => (
            <div
              key={b._id}
              className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              {/* INFO */}
              <div className="space-y-1">
                <p className="text-sm font-semibold truncate">
                  {b.user?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {b.user?.mobile}
                </p>

                <p className="text-sm font-medium truncate">
                  {b.service?.title}
                </p>

                <p className="text-xs text-gray-500">
                  {b.date} · {b.time}
                </p>

                <p className="text-xs text-gray-500 truncate">
                  {b.address}
                </p>
              </div>

              {/* STATUS + ACTIONS */}
              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`px-2 py-1 text-xs rounded-full font-semibold ${
                    b.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : b.status === "accepted"
                      ? "bg-blue-100 text-blue-700"
                      : b.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {b.status.toUpperCase()}
                </span>

                <div className="flex gap-1">
                  {b.status === "pending" && (
                    <>
                      <button
                        disabled={processingId === b._id}
                        onClick={() =>
                          handleStatusUpdate(b._id, "accepted")
                        }
                        className="px-2 py-1 text-xs bg-green-600 text-white rounded"
                      >
                        Accept
                      </button>
                      <button
                        disabled={processingId === b._id}
                        onClick={() =>
                          handleStatusUpdate(b._id, "rejected")
                        }
                        className="px-2 py-1 text-xs bg-red-600 text-white rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {b.status === "accepted" && (
                    <button
                      disabled={processingId === b._id}
                      onClick={() =>
                        handleStatusUpdate(b._id, "completed")
                      }
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
