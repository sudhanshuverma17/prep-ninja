import api, { withAuth } from "../config/api";

const base = "/api/ai";

export const sendChatMessage = (message) =>
    api.post(`${base}/chat`, { message }, withAuth());

export const getChatHistory = () => api.get(`${base}/chat`, withAuth());

export const clearChatHistory = () => api.delete(`${base}/chat`, withAuth());
