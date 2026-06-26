import api from "./api";

/*
* NAME : Dominik Ranegger
* DATE : 05.05
* */

export interface IService {
    id?: number;
    icon: string;
    title: string;
    subtitle?: string;
    price: number;
    duration: number;
}

export const getServices = (): Promise<IService[]> =>
    api.get<IService[]>("/api/services").then((r) => r.data);

export const createService = (
    body: Omit<IService, "id">
): Promise<IService> =>
    api.post<IService>("/api/services", body).then((r) => r.data);

export const updateService = (
    id: number,
    body: Omit<IService, "id">
): Promise<IService> =>
    api.put<IService>(`/api/services/${id}`, body).then((r) => r.data);

export const deleteService = (id: number): Promise<void> =>
    api.delete(`/api/services/${id}`).then(() => undefined);