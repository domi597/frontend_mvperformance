/**
 * Service for registering new customers.
 * @author N
 */

import type { RegisterRequest, RegisterResponse } from "../types/RegisterTypes";
import { registerApi } from "../api/auth";

const RegisterService = {
    /** Registers a new customer, maps form fields to backend format and stores auth data. */
    async register(data: RegisterRequest): Promise<RegisterResponse> {
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

        localStorage.setItem("token", res.token);
        localStorage.setItem("loggedInKunde", JSON.stringify(res.user));

        return { kunde: res.user };
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