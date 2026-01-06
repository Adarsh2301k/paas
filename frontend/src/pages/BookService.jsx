import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfile, createBooking } from "../api/api";
import { Calendar, Clock, Phone, User } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getServiceById } from "../api/api";


const BookService = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    address: "",
    date: "",
    time: "",
  });

  // 🔹 Fetch user + service
  useEffect(() => {
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    try {
      const [userData, serviceData] = await Promise.all([
        getProfile(),
        getServiceById(id),
      ]);

      setUser(userData);
      setService(serviceData);
      setFormData((prev) => ({
        ...prev,
        address: userData.address || "",
      }));
    } catch (err) {
      toast.error("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id, navigate]); // ✅ FIXED & STABLE


  // 🔹 Input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Submit booking
  const handleBooking = async () => {
    const { date, time, address } = formData;

    if (!date || !time || !address.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setProcessing(true);

      await createBooking({
        serviceId: id,
        date,
        time,
        address,
      });

      toast.success("Booking confirmed 🎉");

      setTimeout(() => {
        navigate("/mybooking");
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Booking failed. Try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading booking info…
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Service not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-8 py-10">
      <Toaster position="top-center" />

      {/* ===== BOOKING CARD ===== */}
      <div className="max-w-5xl mx-auto bg-white border rounded-2xl overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row">

          {/* LEFT — IMAGE */}
          <div className="md:w-2/5 bg-gray-100">
            <img
              src={service.image || "/placeholder.png"}
              alt={service.title}
              className="w-full h-72 object-cover"
            />
          </div>

          {/* RIGHT — FORM */}
          <div className="md:w-3/5 p-6 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {service.title}
              </h1>

              <p className="text-sm text-blue-600 mt-1">
                {service.category}
              </p>

              <p className="text-xl font-semibold text-green-600 mt-2">
                ₹{service.price}
              </p>

              {/* USER INFO */}
              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <User size={16} /> {user?.name}
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} /> {user?.mobile}
                </div>
              </div>

              {/* FORM */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Service Address
                  </label>
                  <textarea
                    name="address"
                    rows="2"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Date
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-500" />
                      <input
                        type="date"
                        name="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={formData.date}
                        onChange={handleChange}
                        className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Time
                    </label>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-500" />
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleBooking}
              disabled={processing}
              className={`mt-6 w-full ${
                processing
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white py-2.5 rounded-lg font-semibold transition`}
            >
              {processing ? "Processing..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>

      {/* INFO */}
      <div className="max-w-5xl mx-auto mt-10 text-center text-gray-600">
        <h3 className="font-semibold text-lg mb-2">
          What happens next?
        </h3>
        <p className="text-sm">
          Our service partner will contact you shortly.
          You can manage your bookings from “My Bookings”.
        </p>
      </div>
    </div>
  );
};

export default BookService;
