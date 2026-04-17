/**
 * @file AuthService.ts
 * @description Authentifizierungs-Service — Login, Logout, Token- und Userdaten-Verwaltung.
 * Kommuniziert mit dem Spring Boot Backend über /api/auth/login.
 */

import type { ICustomer } from "../interface/ICustomer";
import { loginApi } from "../api/auth";

// Typen

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: ICustomer;
    // Alias damit LoginPage weiterhin result.kunde nutzen kann
    kunde: ICustomer;
}

// LocalStorage Keys

const TOKEN_KEY = "token";
const KUNDE_KEY = "loggedInKunde";

// Auth Service

const AuthService = {
    /**
     * Login gegen das echte Backend (POST /api/auth/login).
     * Speichert JWT-Token und User-Daten im localStorage.
     */
    async login(data: LoginRequest): Promise<LoginResponse> {
        const res = await loginApi(data);

        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(KUNDE_KEY, JSON.stringify(res.user));

        // "kunde" als Alias zurückgeben — LoginPage nutzt result.kunde.role
        return { ...res, kunde: res.user };
    },

    /**
     * Logout: Token und Userdaten aus localStorage entfernen.
     */
    logout(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(KUNDE_KEY);
    },

    /**
     * Gibt den gespeicherten JWT-Token zurück (oder null).
     */
    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    },

    /**
     * Gibt den eingeloggten User zurück (oder null).
     */
    getKunde(): ICustomer | null {
        const raw = localStorage.getItem(KUNDE_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw) as ICustomer;
        } catch {
            return null;
        }
    },

    /**
     * Ist ein Benutzer eingeloggt?
     */
    isLoggedIn(): boolean {
        return !!this.getToken();
    },

    /**
     * Ist der eingeloggte Benutzer ein Admin?
     */
    isAdmin(): boolean {
        return this.getKunde()?.role === "ADMIN";
    },
};

export default AuthService;

