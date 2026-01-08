import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/providers",
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

/* ================= AUTH ================= */

// Send OTP
export const sendProviderOtp = async (mobile) => {
  const res = await API.post("/send-otp", { mobile });
  return res.data;
};

// Verify OTP
export const verifyProviderOtp = async (mobile, otp) => {
  const res = await API.post("/verify-otp", { mobile, otp });
  return res.data;
};

// Register Provider
export const registerProvider = async (data) => {
  const res = await API.post("/register", data);
  return res.data;
};

/* ================= PROTECTED ================= */

export const createService = async (formData) => {
  const res = await API.post("/create-services", formData);
  return res.data;
};

export const getMyServices = async () => {
  const res = await API.get("/get-services");
  return res.data;
};

export const toggleServiceStatus = async (id) => {
  const res = await API.patch(`/toggle-service/${id}`);
  return res.data;
};

export const deleteService = async (id) => {
  const res = await API.delete(`/delete-service/${id}`);
  return res.data;
};

export const getProviderProfile = async () => {
  const res = await API.get("/profile");
  return res.data;
};

export const updateProviderProfile = async (data) => {
  const res = await API.put("/profile", data);
  return res.data;
};
