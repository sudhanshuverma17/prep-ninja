import api, { withAuth } from "../config/api";

const base = "/api/preparation";

export const getSessions = () => api.get(base, withAuth());

export const generateSession = (data) =>
    api.post(`${base}/generate`, data, withAuth());

export const getSession = (id) => api.get(`${base}/${id}`, withAuth());

export const markQuestionComplete = (qId) =>
    api.put(`${base}/question/${qId}`, {}, withAuth());

export const startQuiz = (id) =>
    api.post(`${base}/${id}/quiz`, {}, withAuth());

export const submitQuiz = (id, answers) =>
    api.post(`${base}/${id}/quiz/submit`, { answers }, withAuth());
