import api from "./api";
import {IService} from "./services.ts";


export interface IOffer {
    id: number;
    title: string;
    description: string;
    price: number;
    duration?: number;
    active: boolean;
    createdAt?: string;
    services: IService[];
}

export const getOffers = (): Promise<IOffer[]> =>
    api.get<IOffer[]>("/api/offers").then((r) => r.data);

export const getOffersByActive = (active: boolean): Promise<IOffer[]> =>
    api.get<IOffer[]>("/api/offers", { params: { active } }).then((r) => r.data);

export const getOfferById = (id: number): Promise<IOffer> =>
    api.get<IOffer>(`/api/offers/${id}`).then((r) => r.data);

export const createOffer = (body: Omit<IOffer, "id" | "createdAt">): Promise<IOffer> =>
    api.post<IOffer>("/api/offers", body).then((r) => r.data);

export const updateOffer = (id: number, body: Omit<IOffer, "id" | "createdAt">): Promise<IOffer> =>
    api.put<IOffer>(`/api/offers/${id}`, body).then((r) => r.data);

export const deleteOfferAPI = (id: number): Promise<void> =>
    api.delete(`/api/offers/${id}`).then(() => undefined);