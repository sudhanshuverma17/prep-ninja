import api, { withAuth } from "../config/api";

const base = "/api/analytics";

export const getAnalytics = () => api.get(base, withAuth());

export const getAchievements = () =>
    api.get(`${base}/achievements`, withAuth());

export const getNotifications = () =>
    api.get(`${base}/notifications`, withAuth());

export const markNotificationRead = (id) =>
    api.put(`${base}/notifications/${id}`, {}, withAuth());
