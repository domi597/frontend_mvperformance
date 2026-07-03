/**
 * API calls for the logged-in customer's own profile.
 */

import api from "./api";
import type { ICustomer } from "../interface/ICustomer";

/** Fetches the current customer's profile from the backend. */
export const getMe = (): Promise<ICustomer> => {
    const raw = sessionStorage.getItem("loggedInKunde");
    const kunde = raw ? (JSON.parse(raw) as ICustomer) : null;
    if (!kunde?.id) return Promise.reject(new Error("Nicht eingeloggt"));
    return api.get<ICustomer>(`/api/users/${kunde.id}`).then((res) => res.data);
};

/** Updates the customer's profile by id. */
export const updateMe = (id: number, data: Partial<ICustomer>): Promise<ICustomer> =>
    api.put<ICustomer>(`/api/users/${id}`, data).then((res) => res.data);

/** Deletes the customer account by id. */
export const deleteMe = (id: number): Promise<void> =>
    api.delete(`/api/users/${id}`).then(() => undefined);

export const getAllCustomers = (): Promise<ICustomer[]> =>
    api.get<ICustomer[]>("/api/users").then((res) => res.data);

export const updateCustomer = (id: number, data: Partial<ICustomer>): Promise<ICustomer> =>
    api.put<ICustomer>(`/api/users/${id}`, data).then((res) => res.data);

export const deleteCustomer = (id: number): Promise<void> =>
    api.delete(`/api/users/${id}`).then(() => undefined);

/** Admin sets a new password for a customer. The old password is never read. */
export const updateCustomerPassword = (id: number, password: string): Promise<void> =>
    api.put(`/api/users/${id}/password`, { password }).then(() => undefined);

/** Self-service password change: requires the current password for verification. */
export const changeMyPassword = (
    id: number,
    oldPassword: string,
    newPassword: string,
    newPasswordConfirm: string,
): Promise<void> =>
    api.put(`/api/users/${id}/password/self`, { oldPassword, newPassword, newPasswordConfirm }).then(() => undefined);