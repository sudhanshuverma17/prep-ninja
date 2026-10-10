import api from "../config/api";

export const loginUser = (formData) => api.post("/api/auth/login", formData);

export const registerUser = (formData) =>
    api.post("/api/auth/register", formData);

export const verifyEmail = (token) =>
    api.get(`/api/auth/verify-email/${token}`);

export const resendVerificationEmail = (email) =>
    api.post("/api/auth/resend-verification", { email });

export const forgotPassword = (email) =>
    api.post("/api/auth/forgot-password", { email });

export const resetPassword = (token, password) =>
    api.post(`/api/auth/reset-password/${token}`, { password });

export default api;
