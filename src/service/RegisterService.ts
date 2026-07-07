/**
 * Service for registering new customers and confirming the e-mail verification code.
 */

import type { PendingVerificationResponse, RegisterRequest } from "../types/RegisterTypes";
import { registerApi, resendVerificationApi, verifyEmailApi } from "../api/auth";
import type { ICustomer } from "../interface/ICustomer";

const PENDING_EMAIL_KEY = "pendingVerificationEmail";

const RegisterService = {
    /** Registers a new customer and maps form fields to backend format. No token is issued yet —
     *  the account must first be confirmed via the 6-digit e-mail code. */
    async register(data: RegisterRequest): Promise<PendingVerificationResponse> {
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
        sessionStorage.setItem(PENDING_EMAIL_KEY, res.email);
        return res;
    },

    /** Confirms the 6-digit code sent by e-mail, stores the resulting JWT + user data. */
    async verifyEmail(email: string, code: string): Promise<ICustomer> {
        const res = await verifyEmailApi({ email, code });

        sessionStorage.setItem("token", res.token);
        sessionStorage.setItem("loggedInKunde", JSON.stringify(res.user));
        sessionStorage.removeItem(PENDING_EMAIL_KEY);

        return res.user;
    },

    /** Requests a fresh verification code for the given e-mail address. */
    async resendVerification(email: string): Promise<void> {
        await resendVerificationApi({ email });
    },

    /** Returns the e-mail address awaiting verification (set right after registration), or null. */
    getPendingVerificationEmail(): string | null {
        return sessionStorage.getItem(PENDING_EMAIL_KEY);
    },

    /** Stores a success message in localStorage for the home page to display. */
    setSuccessMessage(message: string): void {
        localStorage.setItem("successMessage", message);
    },

    /** Reads and removes the success message from localStorage (one-time display). */
    popSuccessMessage(): string | null {
        const msg = localStorage.getItem("successMessage");
        if (msg) localStorage.removeItem("successMessage");
        return msg;
    },
};

export default RegisterService;