/**
 * Central Axios instance for all backend requests.
 * Attaches the JWT token to every non-public-auth request and redirects to login on 401.
 */

import axios from "axios";

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL as string | undefined)?.trim() || "",
});

/** Adds the Bearer token to every request that is not a public auth endpoint (login/register). */
api.interceptors.request.use((config) => {
    const url = config.url ?? "";
    const isPublicAuthEndpoint = url.includes("/api/auth/login") || url.includes("/api/auth/register");

    if (!isPublicAuthEndpoint) {
        const token = sessionStorage.getItem("token");
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
        const isPublicAuthEndpoint = url.includes("/api/auth/login") || url.includes("/api/auth/register");
        // Wrong-current-password on the account page must never trigger an auto-logout —
        // the user needs to see the error message, not get silently redirected to /login.
        const isSelfPasswordChange = url.includes("/password/self");

        if (err.response?.status === 401 && !isPublicAuthEndpoint && !isSelfPasswordChange) {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("loggedInKunde");
            window.location.href = "/login";
        }

        return Promise.reject(err);
    }
);

export default api;