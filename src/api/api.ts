// api.ts
// Zentrale axios-Instanz für alle HTTP-Anfragen an das Spring Boot Backend.
// Alle API-Calls im Projekt sollen diese Instanz verwenden, damit
// Token-Handling und Fehlerbehandlung automatisch greifen. -N 27.03.2026

import axios from "axios";

// Axios-Instanz mit der Backend-URL aus der .env Datei (VITE_API_URL).
// Ist keine .env vorhanden, wird ein leerer String verwendet —
// dann müssen API-Calls mit dem vollen Pfad aufgerufen werden. -N 27.03.2026
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string | undefined)?.trim() || "",
});

// Request-Interceptor: JWT-Token automatisch bei jedem Request mitsenden.
// Der Token wird aus dem localStorage gelesen und als Bearer-Token
// im Authorization-Header gesetzt, sofern ein Token vorhanden ist. -N 27.03.2026
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response-Interceptor: Automatisches Ausloggen bei abgelaufenem Token.
// Gibt das Backend einen 401-Fehler zurück (Token ungültig / abgelaufen),
// werden Token und Kundendaten aus dem localStorage entfernt und
// der Nutzer wird zur Login-Seite weitergeleitet.
// Alle anderen Fehler werden unverändert weitergegeben (Promise.reject). -N 27.03.2026
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Gespeicherte Anmeldedaten löschen -N 27.03.2026
      localStorage.removeItem("token");
      localStorage.removeItem("loggedInKunde");
      // Hartweiterleitung zur Login-Seite (kein React-Router, da außerhalb) -N 27.03.2026
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

export default api;
