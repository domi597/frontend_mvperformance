// auth.ts
// API-Calls für Login und Registrierung gegen das Spring Boot Backend.

import api from "./api";
import type { LoginRequest, LoginResponse } from "../service/AuthService";
import type { RegisterRequest } from "../types/RegisterTypes";
import type { AuthResponse } from "../types/AuthTypes";

export const loginApi = (data: LoginRequest): Promise<LoginResponse> =>
    api.post<LoginResponse>("/api/auth/login", data).then((res) => res.data);

export const registerApi = (data: RegisterRequest): Promise<AuthResponse> =>
    api.post<AuthResponse>("/api/auth/register", data).then((res) => res.data);

