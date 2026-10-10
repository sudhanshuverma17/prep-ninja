import axios from "axios";

export const API_BASE_URL =
    process.env.REACT_APP_API_URL !== undefined
        ? process.env.REACT_APP_API_URL
        : process.env.NODE_ENV === "production"
        ? ""
        : "http://localhost:5000";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const withAuth = () => ({ headers: getAuthHeaders() });

export const getErrorMessage = (error, fallback = "Request failed") => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
        const target = API_BASE_URL || window.location.origin;
        return `Cannot reach the server at ${target}. Make sure the backend is running.`;
    }
    return fallback;
};

export default api;
