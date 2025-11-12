import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 🔹 OTP Send (common)
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

// 🔹 Profile routes
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
        "Content-Type": "multipart/form-data", // crucial for FormData
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  
};


// services

export const getProviders = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const { data } = await API.get(`/providers?${query}`);
  return data;
};

export const getProviderDetails = async (id) => {
  const { data } = await API.get(`/providers/${id}`);
  return data;
};


// booking

// 🔹 Create a new booking
export const createBooking = async (formData) => {
  const token = localStorage.getItem("token");
  const { data } = await API.post("/bookings", formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
// 🔹 Fetch all bookings for logged-in user
export const getMyBookings = async () => {
  const token = localStorage.getItem("token");
  const { data } = await API.get("/bookings/my", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// 🔹 Cancel a booking
// 🔹 Cancel a booking
export const cancelBooking = async (id) => {
  const token = localStorage.getItem("token");
  const { data } = await API.put(
    `/bookings/${id}/status`,
    { status: "cancelled" },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};




