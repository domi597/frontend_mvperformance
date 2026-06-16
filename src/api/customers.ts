/**
 * API calls for the logged-in customer's own profile.
 * @author N
 */

import api from "./api";
import type { ICustomer } from "../interface/ICustomer";

/** Fetches the current customer's profile from the backend. */
export const getMe = (): Promise<ICustomer> => {
    const raw = localStorage.getItem("loggedInKunde");
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
