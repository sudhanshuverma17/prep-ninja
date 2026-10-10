import api, { withAuth } from "../config/api";

const base = "/api/resumes";

export const uploadResume = (formData) =>
    api.post(`${base}/upload`, formData, {
        headers: {
            ...withAuth().headers,
            "Content-Type": "multipart/form-data",
        },
    });

export const getResumeHistory = () => api.get(`${base}/history`, withAuth());

export const getResumeById = (id) => api.get(`${base}/${id}`, withAuth());

export const deleteResume = (id) => api.delete(`${base}/${id}`, withAuth());
