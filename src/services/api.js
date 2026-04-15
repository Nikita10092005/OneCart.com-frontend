import axios from "axios";

const RAILWAY_URL = "https://onecart-backend-production-400c.up.railway.app/api";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || RAILWAY_URL
});

API.interceptors.request.use((config) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const token = storedToken || storedUser?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

// ── Seller API helpers ──────────────────────────────────────────────────────
export const getSellerAnalytics = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return API.get(`/seller/analytics${qs ? `?${qs}` : ""}`);
};

export const getSellerPayouts = () => API.get("/seller/payouts");

export const getSellerInventory = () => API.get("/seller/inventory");

export const updateSellerProduct = (id, data) => API.put(`/seller/inventory/${id}`, data);

export const deleteSellerProduct = (id) => API.delete(`/seller/inventory/${id}`);

export const bulkUploadCSV = (formData) =>
  API.post("/seller/products/bulk-upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getSellerProfile = (sellerId) => API.get(`/seller/profile/${sellerId}`);

export const applyForSeller = () => API.post("/seller/apply");

export const setVacationMode = (enabled) => API.put("/seller/vacation", { enabled });

export const applyForSellerWithDetails = (data) => API.post("/seller/apply", data);
export const getMyApplication = () => API.get("/seller/my-application");
export const fboEnroll = (data) => API.post("/seller/fbo-enroll", data);
export const getMyFboEnrollment = () => API.get("/seller/my-fbo-enrollment");

// ── Admin API helpers ───────────────────────────────────────────────────────
export const getFboEnrollments = () => API.get("/admin/fbo-enrollments");
export const approveFboEnrollment = (id) => API.put(`/admin/fbo-enrollments/${id}/approve`);
export const rejectFboEnrollment = (id, rejectionReason) => API.put(`/admin/fbo-enrollments/${id}/reject`, { rejectionReason });
export const rejectSellerApplicationAdmin = (id, rejectionReason) => API.put(`/admin/seller-applications/${id}/reject`, { rejectionReason });
