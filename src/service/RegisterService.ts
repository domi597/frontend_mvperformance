// RegisterService.ts
// Registrierungs-Logik: kommuniziert mit dem Backend über /api/auth/register.

import type { RegisterRequest, RegisterResponse } from "../types/RegisterTypes";
import { registerApi } from "../api/auth";

const RegisterService = {
    /**
     * Registrierung gegen das echte Backend (POST /api/auth/register).
     * Speichert bei Erfolg Token + User im localStorage (Auto-Login).
     */
    async register(data: RegisterRequest): Promise<RegisterResponse> {
        // Felder auf Backend-Format mappen (Frontend nutzt deutsche Namen)
        const backendPayload = {
            firstName:            data.vorname,
            lastName:             data.nachname,
            email:                data.email,
            password:             data.password,
            phone:                data.telefon,
            street:               data.strasse,
            zip:                  data.plz      || undefined,
            city:                 data.ort,
            vehicleBrand:         data.marke        || undefined,
            vehicleModel:         data.modell       || undefined,
            vehicleBuildYear:     data.baujahr      ?? undefined,
            vehicleLicensePlate:  data.kennzeichen  || undefined,
        };

        const res = await registerApi(backendPayload as never);

        // Auto-Login: Token und User direkt speichern
        localStorage.setItem("token", res.token);
        localStorage.setItem("loggedInKunde", JSON.stringify(res.user));

        return { kunde: res.user };
    },

    /**
     * Speichert eine Erfolgsmeldung im localStorage.
     * Die HomePage liest diese aus und zeigt sie als Snackbar an.
     */
    setSuccessMessage(message: string): void {
        localStorage.setItem("successMessage", message);
    },

    /**
     * Liest die Erfolgsmeldung aus und löscht sie danach sofort (einmalige Anzeige).
     */
    popSuccessMessage(): string | null {
        const msg = localStorage.getItem("successMessage");
        if (msg) localStorage.removeItem("successMessage");
        return msg;
    },
};

export default RegisterService;