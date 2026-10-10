import api, { withAuth } from "../config/api";

const base = "/api/study-plan";

export const getStudyPlan = () => api.get(base, withAuth());

export const generateStudyPlan = (data) =>
    api.post(`${base}/generate`, data, withAuth());

export const updateStudyPlan = (data) =>
    api.put(base, data, withAuth());
