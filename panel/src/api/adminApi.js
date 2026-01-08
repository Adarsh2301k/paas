import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin",
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

/* ========= SERVICES ========= */

export const getAllServicesAdmin = async () => {
  const res = await API.get("/allservices");
  return res.data;
};

export const approveServiceAdmin = async (id) => {
  const res = await API.patch(`/service/approve/${id}`);
  return res.data;
};

export const toggleServiceAdmin = async (id) => {
  const res = await API.patch(`/service/toggle/${id}`);
  return res.data;
};

/* ========= PROVIDERS ========= */

export const getAllProvidersAdmin = async () => {
  const res = await API.get("/allproviders");
  return res.data;
};

export const toggleProviderBan = async (id) => {
  const res = await API.patch(`/provider/ban/${id}`, null);
  return res.data;
};

