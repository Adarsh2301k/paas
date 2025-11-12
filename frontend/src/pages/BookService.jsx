import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProviderDetails, getProfile, createBooking } from "../api/api";
import { Calendar, Clock, Phone, User } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

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

  // ✅ Fetch user + service data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, serviceData] = await Promise.all([
          getProfile(),
          getProviderDetails(id),
        ]);
        setUser(userData);
        setService(serviceData);
        setFormData((prev) => ({
          ...prev,
          address: userData.address || "",
        }));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ✅ Input change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Booking submit handler
  const handleBooking = async () => {
    const { date, time, address } = formData;

    if (!date || !time || !address) {
      toast.error("Please fill all fields before confirming!");
      return;
    }

    try {
      setProcessing(true);
      const payload = {
        serviceId: id,
        date,
        time,
        address,
      };

      await createBooking(payload);
      toast.success("Booking confirmed successfully! 🎉");

      setTimeout(() => {
        navigate("/mybooking");
      }, 1000);
    } catch (err) {
      console.error("Booking error:", err);
      toast.error(err.response?.data?.message || "Booking failed. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading booking info...
      </div>
    );

  if (!service)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Service not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-8 py-10">
      <Toaster position="top-center" />

      {/* ===== Booking Card ===== */}
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl overflow-hidden border">
        <div className="flex flex-col md:flex-row">
          {/* Left - Service Image */}
          <div className="md:w-2/5">
            <img
              src={service.image || "/assets/sample.jpg"}
              alt={service.name}
              className="w-full h-72 object-cover"
            />
          </div>

          {/* Right - Booking Form */}
          <div className="md:w-3/5 p-6 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 mb-1">
                {service.name}
              </h1>
              <p className="text-blue-600 mb-3">{service.category}</p>
              <p className="text-green-600 font-bold mb-3">₹{service.price}</p>

              {/* User Info */}
              <div className="space-y-3 mb-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <User size={18} /> <span>{user?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone size={18} /> <span>{user?.mobile}</span>
                </div>
              </div>

              {/* Booking Fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="2"
                    className="w-full border rounded-md p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Date
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-gray-500" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="border rounded-md p-2 w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Preferred Time
                  </label>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-gray-500" />
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="border rounded-md p-2 w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={processing}
              className={`mt-6 ${
                processing ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white py-2 rounded-lg font-medium transition`}
            >
              {processing ? "Processing..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>

      {/* ===== Info Section ===== */}
      <div className="max-w-5xl mx-auto mt-10 text-center text-gray-600">
        <h3 className="font-semibold text-lg mb-2">What happens next?</h3>
        <p className="text-sm">
          Our verified service partner will contact you soon after your booking.
          You can track and manage your bookings in the “My Bookings” section.
        </p>
      </div>
    </div>
  );
};

export default BookService;
