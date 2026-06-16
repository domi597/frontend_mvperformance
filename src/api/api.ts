/**
 * Central Axios instance for all backend requests.
 * Attaches the JWT token to every non-auth request and redirects to login on 401.
 * @author N
 * @since 27.03.2026
 */

import axios from "axios";

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL as string | undefined)?.trim() || "",
});

/** Adds the Bearer token to every request that is not an auth endpoint. */
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

/** Clears auth data and redirects to login on a 401 response. */
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
