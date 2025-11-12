import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/provider",
});

// ✅ AUTH
export const sendOtp = (mobile) => API.post("/send-otp", { mobile });
export const verifyOtp = (mobile, otp) =>
  API.post("/verify-otp", { mobile, otp });

// ✅ REGISTER
export const registerProvider = (formData, token) =>
  API.post("/register", formData, {
    headers: { Authorization: `Bearer ${token}` },
  });

// ✅ PROFILE
export const getProfile = (token) =>
  API.get("/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateProfile = (data, token) =>
  API.put("/me", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// ✅ BOOKINGS
export const getBookings = (token) =>
  API.get("/bookings", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const completeBooking = (id, token) =>
  API.put(
    `/bookings/${id}/complete`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

// ✅ DASHBOARD
export const getDashboardStats = (token) =>
  API.get("/dashboard-stats", {
    headers: { Authorization: `Bearer ${token}` },
  });
