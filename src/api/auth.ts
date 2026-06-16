/**
 * Auth API calls — login and registration.
 * @author N
 * @since 27.03.2026
 */

import api from "./api";
import type { LoginRequest, LoginResponse } from "../service/AuthService";
import type { RegisterRequest } from "../types/RegisterTypes";
import type { AuthResponse } from "../types/AuthTypes";

/** Sends login credentials and returns the JWT token with user data. */
export const loginApi = (data: LoginRequest): Promise<LoginResponse> =>
    api.post<LoginResponse>("/api/auth/login", data).then((res) => res.data);

/** Registers a new customer and returns the auth response. */
export const registerApi = (data: RegisterRequest): Promise<AuthResponse> =>
    api.post<AuthResponse>("/api/auth/register", data).then((res) => res.data);

