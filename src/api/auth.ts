import api from "./api";

export const login = (email: string, password: string) =>
  api.post("/api/auth/login", { email, password });

export const register = (data: {
  vorname: string;
  nachname: string;
  email: string;
  password: string;
  telefon: string;
  strasse: string;
  plz: string;
  ort: string;
  marke?: string;
  modell?: string;
  baujahr?: number;
  kennzeichen?: string;
}) => api.post("/api/auth/register", data);

export const forgotPassword = (email: string) =>
  api.post("/api/auth/forgot-password", { email });
