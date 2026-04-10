// RegisterService.ts
// Enthält die gesamte Logik für die Registrierung eines neuen Kunden.
// Die RegisterPage selbst ist nur für die UI zuständig. -N 07.04.2026

import type { IKunde } from "../interface/IKunde";
import type { RegisterRequest, RegisterResponse } from "../types/RegisterTypes";

// Register Service

const RegisterService = {
  /**
   * Mock-Registrierung: simuliert einen erfolgreichen API-Call.
   * Wenn das Backend fertig ist, diesen Block durch einen echten
   * api.post("/api/auth/register", data) Call ersetzen. -N 07.04.2026
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    // TODO: echten API-Call einbauen wenn Backend fertig ist
    // const res = await api.post<RegisterResponse>("/api/auth/register", data);
    // return res.data;

    // Mock: kurze Verzögerung simuliert Netzwerk-Request
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock-Antwort: neuer Kunde wird zurückgegeben
    const neuerKunde: IKunde = {
      kundeId: Date.now(),
      vorname: data.vorname,
      nachname: data.nachname,
      email: data.email,
      telefon: data.telefon,
      strasse: data.strasse,
      plz: data.plz,
      ort: data.ort,
      marke: data.marke,
      modell: data.modell,
      baujahr: data.baujahr,
      kennzeichen: data.kennzeichen,
      role: "KUNDE",
      createdAt: new Date().toISOString(),
    };

    return { kunde: neuerKunde };
  },

  /**
   * Speichert eine Erfolgsmeldung im localStorage.
   * Die HomePage liest diese aus und zeigt sie als Snackbar an. -N 07.04.2026
   */
  setSuccessMessage(message: string): void {
    localStorage.setItem("successMessage", message);
  },

  /**
   * Liest die Erfolgsmeldung aus und löscht sie danach sofort.
   * So wird sie nur einmal angezeigt. -N 07.04.2026
   */
  popSuccessMessage(): string | null {
    const msg = localStorage.getItem("successMessage");
    if (msg) localStorage.removeItem("successMessage");
    return msg;
  },
};

export default RegisterService;
