import api from "./api";
import type { LoginRequest, LoginResponse } from "../service/AuthService";
import type { PendingVerificationResponse, RegisterRequest } from "../types/RegisterTypes";
import type { AuthResponse } from "../types/AuthTypes";

export interface UserDTO {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    zip: string;
    city: string;
    role: string;
    createdAt: string;
    themeAccess: boolean;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
    newPasswordConfirm: string;
}

export interface VerifyEmailRequest {
    email: string;
    code: string;
}

export interface ResendVerificationRequest {
    email: string;
}

/** Sends login credentials and returns the JWT token with user data. */
export const loginApi = (data: LoginRequest): Promise<LoginResponse> =>
    api.post<LoginResponse>("/api/auth/login", data).then((res) => res.data);

/** Registers a new customer. Returns a "pending verification" response — no token yet. */
export const registerApi = (data: RegisterRequest): Promise<PendingVerificationResponse> =>
    api.post<PendingVerificationResponse>("/api/auth/register", data).then((res) => res.data);

/** Bestätigt die E-Mail-Adresse mit dem 6-stelligen Code und liefert danach Token + Nutzerdaten. */
export const verifyEmailApi = (data: VerifyEmailRequest): Promise<AuthResponse> =>
    api.post<AuthResponse>("/api/auth/verify-email", data).then((res) => res.data);

/** Fordert einen neuen Bestätigungscode für ein noch nicht verifiziertes Konto an. */
export const resendVerificationApi = (data: ResendVerificationRequest): Promise<void> =>
    api.post("/api/auth/resend-verification", data).then(() => undefined);

export const meApi = (): Promise<UserDTO> =>
    api.get<UserDTO>("/api/auth/me").then((res) => res.data);

/** Tauscht ein noch gültiges Token gegen ein frisches mit neuer Ablaufzeit (Session verlängern). */
export const refreshApi = (): Promise<LoginResponse> =>
    api.post<LoginResponse>("/api/auth/refresh").then((res) => res.data);

/** Fordert einen Passwort-Reset-Link für die angegebene E-Mail-Adresse an. */
export const forgotPasswordApi = (data: ForgotPasswordRequest): Promise<void> =>
    api.post("/api/auth/forgot-password", data).then(() => undefined);

/** Setzt anhand eines gültigen Reset-Tokens ein neues Passwort. */
export const resetPasswordApi = (data: ResetPasswordRequest): Promise<void> =>
    api.post("/api/auth/reset-password", data).then(() => undefined);