/**
 * Service for the account page — profile and vehicle operations.
 */

import { getMe, updateMe, deleteMe, changeMyPassword } from "../api/customers";
import { getVehiclesByUser, createVehicle, updateVehicle, deleteVehicle } from "../api/vehicleApi";
import type { ICustomer } from "../interface/ICustomer";
import type { IVehicle } from "../interface/IVehicle";

export interface VehicleForm {
    brand: string;
    model: string;
    buildYear: string;
    licensePlate: string;
}

export const MyAccountService = {
    /** Fetches the logged-in customer's profile. */
    fetchCustomer(): Promise<ICustomer> {
        return getMe();
    },

    /** Fetches all vehicles for the given customer. */
    fetchVehicles(customerId: number): Promise<IVehicle[]> {
        return getVehiclesByUser(customerId);
    },

    /** Builds a profile patch object from the edited field and its value(s). */
    buildPatch(
        field: "name" | "email" | "phone" | "address",
        value: string,
        value2: string,
    ): Partial<ICustomer> {
        if (field === "name") return { firstName: value.trim(), lastName: value2.trim() };
        if (field === "email") return { email: value.trim() };
        if (field === "phone") return { phone: value.trim() || null };
        return { street: value.trim() || null, city: value2.trim() || null };
    },

    /** Saves a profile patch to the backend and updates sessionStorage. */
    async updateProfile(customerId: number, patch: Partial<ICustomer>): Promise<ICustomer> {
        const updated = await updateMe(customerId, patch);
        sessionStorage.setItem("loggedInKunde", JSON.stringify(updated));
        return updated;
    },

    /** Creates a new vehicle or updates an existing one if editingId is set. */
    async saveVehicle(
        customerId: number,
        form: VehicleForm,
        editingId?: number,
    ): Promise<IVehicle> {
        const payload = {
            brand: form.brand.trim(),
            model: form.model.trim(),
            buildYear: form.buildYear ? parseInt(form.buildYear) : null,
            licensePlate: form.licensePlate.trim() || null,
        };
        if (editingId !== undefined) {
            return updateVehicle(editingId, payload);
        }
        return createVehicle(customerId, payload);
    },

    /** Deletes a vehicle by id. */
    removeVehicle(vehicleId: number): Promise<void> {
        return deleteVehicle(vehicleId);
    },

    /** Deletes the account and clears auth data from sessionStorage. */
    async removeAccount(customerId: number): Promise<void> {
        await deleteMe(customerId);
        sessionStorage.removeItem("loggedInKunde");
        sessionStorage.removeItem("token");
    },

    /** Changes the logged-in customer's own password (current password required). */
    changePassword(
        customerId: number,
        oldPassword: string,
        newPassword: string,
        newPasswordConfirm: string,
    ): Promise<void> {
        return changeMyPassword(customerId, oldPassword, newPassword, newPasswordConfirm);
    },
};