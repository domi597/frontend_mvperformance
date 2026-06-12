/**
 * Service for login, logout and reading auth state from localStorage.
 * @author N
 */

import type { ICustomer } from "../interface/ICustomer";
import { loginApi } from "../api/auth";


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
    /** Logs in, stores JWT and user data in localStorage. */
    async login(data: LoginRequest): Promise<LoginResponse> {
        const res = await loginApi(data);

        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(KUNDE_KEY, JSON.stringify(res.user));

        return { ...res, kunde: res.user };
    },

    /** Removes token and user data from localStorage. */
    logout(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(KUNDE_KEY);
    },

    /** Returns the stored JWT token or null. */
    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    },

    /** Returns the logged-in customer or null. */
    getKunde(): ICustomer | null {
        const raw = localStorage.getItem(KUNDE_KEY);
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
