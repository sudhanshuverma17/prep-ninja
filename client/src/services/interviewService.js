import api, { withAuth } from "../config/api";

const base = "/api/interviews";

export const createInterview = (data) =>
    api.post(`${base}/create`, data, withAuth());

export const getInterviews = () => api.get(base, withAuth());

export const getInterviewById = (id) =>
    api.get(`${base}/${id}`, withAuth());

export const submitAnswer = (id, data) =>
    api.post(`${base}/${id}/answer`, data, withAuth());

export const completeInterview = (id) =>
    api.post(`${base}/${id}/complete`, {}, withAuth());
