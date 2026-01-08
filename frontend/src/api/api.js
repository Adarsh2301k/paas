import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* ================= AUTH / OTP ================= */

// 🔹 Send OTP
export const sendOtp = async (payload) => {
  const { data } = await API.post("/users/send-otp", payload);
  return data;
};

// 🔹 Login verify
export const verifyLoginOtp = async (payload) => {
  const { data } = await API.post("/users/verify-login", payload);
  return data;
};

// 🔹 Register verify
export const verifyRegisterOtp = async (payload) => {
  const { data } = await API.post("/users/verify-register", payload);
  return data;
};

/* ================= PROFILE ================= */

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  const { data } = await API.get("/users/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updateProfile = async (formData) => {
  const token = localStorage.getItem("token");
  const { data } = await API.put("/users/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
// ================= SERVICES (FINAL) =================

// 🔹 Get services (ALL / FILTERED)
export const getServices = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const { data } = await API.get(`/services?${query}`);
  return data;
};
export const getServiceById = async (id) => {
  const { data } = await API.get(`/services/${id}`);
  return data;
}

// 🔹 Create service (provider / admin)
export const createService = async (payload) => {
  const token = localStorage.getItem("token");
  const { data } = await API.post("/services", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

/* ================= BOOKINGS (UNCHANGED) ================= */

// 🔹 Create booking
export const createBooking = async (formData) => {
  const token = localStorage.getItem("token");
  const { data } = await API.post("/bookings/create", formData, { 
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// 🔹 Get my bookings
export const getMyBookings = async () => {
  const token = localStorage.getItem("token");
  const { data } = await API.get("/bookings/my", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// 🔹 Cancel booking
// api.js
export const cancelBooking = async (bookingId) => {
  const token = localStorage.getItem("token");
  const { data } = await API.put(
    `/bookings/cancel/${bookingId}`,
    {},
    {headers: {Authorization: `Bearer ${token}`,},
  });
  return data;
};

// 🔹 Get available slots
export const getAvailableSlots = async (serviceId, date) => {
  const { data } = await API.get(
    `/bookings/available-slots?serviceId=${serviceId}&date=${date}`
  );
  return data;
};

/* ================= OLD / PARKED (DO NOT USE NOW) ================= */
// These stay for later, but Services.jsx should NOT use them

export const getProviders = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const { data } = await API.get(`/providers?${query}`);
  return data;
};

export const getProviderDetails = async (id) => {
  const { data } = await API.get(`/providers/${id}`);
  return data;
};
