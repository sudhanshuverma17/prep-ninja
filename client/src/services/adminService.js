import api, { withAuth } from "../config/api";

const base = "/api/admin";

export const getAdminStats = () => api.get(`${base}/stats`, withAuth());

export const getAllUsers = () => api.get(`${base}/users`, withAuth());

export const updateUserRole = (userId, role) =>
    api.put(`${base}/users/${userId}/role`, { role }, withAuth());

export const deleteUser = (userId) =>
    api.delete(`${base}/users/${userId}`, withAuth());

export const broadcastNotification = (data) =>
    api.post(`${base}/broadcast`, data, withAuth());
