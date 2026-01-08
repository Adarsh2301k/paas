import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/bookings",
});

/* ================= INTERCEPTOR ================= */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("providerToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
/* ================= BOOKINGS ================= */

// Get all bookings for provider services
export const getProviderBookings = async () => {
  const res = await API.get("/provider");
  return res.data;
};

// Update booking status (accept / reject / complete)
export const updateBookingStatus = async (bookingId, status) => {
  const res = await API.put(`/provider/${bookingId}/status`, { status });
  return res.data;
};
