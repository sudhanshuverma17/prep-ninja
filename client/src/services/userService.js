import api, { withAuth } from "../config/api";

const base = "/api/users";

export const getProfile = () => api.get(`${base}/profile`, withAuth());

export const updateProfile = (data) =>
    api.put(`${base}/profile`, data, withAuth());

export const deleteProfile = () => api.delete(`${base}/profile`, withAuth());
