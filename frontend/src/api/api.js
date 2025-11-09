import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/users",
});

// 🔹 OTP Send (common)
export const sendOtp = async (payload) => {
  const { data } = await API.post("/send-otp", payload);
  return data;
};


// 🔹 Login verify
export const verifyLoginOtp = async (payload) => {
  const { data } = await API.post("/verify-login", payload);
  return data;
};

// 🔹 Register verify
export const verifyRegisterOtp = async (payload) => {
  const { data } = await API.post("/verify-register", payload);
  return data;
};

// 🔹 Profile routes
export const getProfile = async () => {
  const token = localStorage.getItem("token");
  const { data } = await API.get("/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updateProfile = async (formData) => {
 
    const token = localStorage.getItem("token");
    const { data } = await API.put("/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // crucial for FormData
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  
};
