/**
 * @file api.ts
 * @description Central Axios instance for all HTTP requests to the Spring Boot backend.
 * All API calls in the project use this instance for automatic token handling
 * and consistent error processing.
 * @author N
 * @since 27.03.2026
 */

import axios from "axios";

/**
 * Axios instance configured with the backend URL from `.env` (`VITE_API_URL`).
 * Falls back to an empty string if the variable is not set.
 */
const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL as string | undefined)?.trim() || "",
});

/**
 * Request interceptor: attaches the JWT token as a Bearer header to every request.
 * Auth endpoints (`/api/auth/`) are excluded as they do not require a token.
 */
api.interceptors.request.use((config) => {
    const url = config.url ?? "";
    const isAuthEndpoint = url.includes("/api/auth/");

    if (!isAuthEndpoint) {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

/**
 * Response interceptor: automatically signs the user out on a `401` response.
 * Removes the token and customer data from `localStorage` and redirects to the login page.
 * Auth endpoints are excluded so that login errors are propagated normally.
 */
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const url = err.config?.url ?? "";
        const isAuthEndpoint = url.includes("/api/auth/");

        if (err.response?.status === 401 && !isAuthEndpoint) {
            localStorage.removeItem("token");
            localStorage.removeItem("loggedInKunde");
            window.location.href = "/login";
        }

        return Promise.reject(err);
    }
);

export default api;
