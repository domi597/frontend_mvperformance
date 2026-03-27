import type { IKunde } from "../interface/IKunde";
import { MOCK_KUNDEN } from "../mockdata/mock_data";


// Typen

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  kunde: IKunde;
}

// LocalStorage Keys

const TOKEN_KEY = "token";
const KUNDE_KEY = "loggedInKunde";

// Auth Service

const AuthService = {
  /**
   * Mock-Login: sucht den Kunden anhand der E-Mail in den Mockdaten.
   * Passwort wird nicht geprüft (beliebig, min. 6 Zeichen via Formular-Validierung).
   * Gibt einen gefakten Token + Kundendaten zurück. -N 27.03.2026
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    // Kunde anhand der E-Mail in den Mockdaten suchen
    const kunde = MOCK_KUNDEN.find(
      (k) => k.email.toLowerCase() === data.email.toLowerCase()
    );

    // Kein Treffer → 404 simulieren
    if (!kunde) {
      return Promise.reject({ response: { status: 404 } });
    }

    // Passwort prüfen → 401 simulieren bei falschem Passwort
    if (kunde.passwort !== data.password) {
      return Promise.reject({ response: { status: 401 } });
    }

    // Gefakter JWT-Token (enthält keine echten Daten)
    const token = `mock-token-${kunde.kundeId}`;

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(KUNDE_KEY, JSON.stringify(kunde));

    return { token, kunde };
  },

  /**
   * Logout: entfernt JWT + Kundendaten aus localStorage -N 27.03.2026
   */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(KUNDE_KEY);
  },

  /**
   * Gibt den gespeicherten JWT-Token zurück (oder null) -N 27.03.2026
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Gibt den eingeloggten Kunden zurück (oder null) -N 27.03.2026
   */
  getKunde(): IKunde | null {
    const raw = localStorage.getItem(KUNDE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as IKunde;
    } catch {
      return null;
    }
  },

  /**
   * Ist ein Benutzer eingeloggt? -N 27.03.2026
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  },

  /**
   * Ist der eingeloggte Benutzer ein Admin? -N 27.03.2026
   */
  isAdmin(): boolean {
    return this.getKunde()?.role === "ADMIN";
  },
};

export default AuthService;
