/**
 * API calls for vehicle CRUD operations.
 * All routes require a valid JWT (attached automatically by the Axios interceptor).
 * @author N
 */

import api from "./api";
import type { IVehicle } from "../interface/IVehicle";

export const getVehiclesByUser = (userId: number): Promise<IVehicle[]> =>
    api.get<IVehicle[]>(`/api/vehicles/user/${userId}`).then((r) => r.data);

export const createVehicle = (userId: number, data: Omit<IVehicle, "id" | "userId">): Promise<IVehicle> =>
    api.post<IVehicle>(`/api/vehicles/user/${userId}`, data).then((r) => r.data);

export const updateVehicle = (id: number, data: Omit<IVehicle, "id" | "userId">): Promise<IVehicle> =>
    api.put<IVehicle>(`/api/vehicles/${id}`, data).then((r) => r.data);

export const deleteVehicle = (id: number): Promise<void> =>
    api.delete(`/api/vehicles/${id}`).then(() => undefined);
