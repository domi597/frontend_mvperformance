/**
 * Service for login, logout and reading auth state from sessionStorage (cleared when the tab is closed).
 */

import type { ICustomer } from "../interface/ICustomer";
import { loginApi, refreshApi } from "../api/auth";
import { getTokenExpiryMs } from "../utils/jwt";


export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: ICustomer;
    kunde: ICustomer;
}


const TOKEN_KEY = "token";
const KUNDE_KEY = "loggedInKunde";


const AuthService = {
    /** Logs in, stores JWT and user data in sessionStorage. */
    async login(data: LoginRequest): Promise<LoginResponse> {
        const res = await loginApi(data);

        sessionStorage.setItem(TOKEN_KEY, res.token);
        sessionStorage.setItem(KUNDE_KEY, JSON.stringify(res.user));

        return { ...res, kunde: res.user };
    },

    /** Removes token and user data from sessionStorage. */
    logout(): void {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(KUNDE_KEY);
    },

    async refresh(): Promise<LoginResponse> {
        const res = await refreshApi();

        sessionStorage.setItem(TOKEN_KEY, res.token);
        sessionStorage.setItem(KUNDE_KEY, JSON.stringify(res.user));

        return { ...res, kunde: res.user };
    },

    /** Returns the stored JWT token or null. */
    getToken(): string | null {
        return sessionStorage.getItem(TOKEN_KEY);
    },

    /** Gibt den Ablaufzeitpunkt (ms seit Epoch) des aktuellen Tokens zurück, oder null. */
    getTokenExpiryMs(): number | null {
        const token = this.getToken();
        if (!token) return null;
        return getTokenExpiryMs(token);
    },

    /** Returns the logged-in customer or null. */
    getKunde(): ICustomer | null {
        const raw = sessionStorage.getItem(KUNDE_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw) as ICustomer;
        } catch {
            return null;
        }
    },

    /** Returns true if a user is currently logged in. */
    isLoggedIn(): boolean {
        return !!this.getToken();
    },

    /** Returns true if the logged-in user has the ADMIN role. */
    isAdmin(): boolean {
        return this.getKunde()?.role === "ADMIN";
    },
};

export default AuthService;