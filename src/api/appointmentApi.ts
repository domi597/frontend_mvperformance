import api from "./api";
import { AppointmentStatus } from "../types/AppointmentStatus";
import { IAppointment } from "../interface/IAppointment";

export type { AppointmentStatus };

/*
* NAME : Dominik Ranegger
* DATE : 14.04
* */


export interface AppointmentPage {
    content: IAppointment[];
    totalPages: number;
    totalElements: number;
    number: number;
}

export const getAppointments = (
    status?: AppointmentStatus,
    page = 0,
    size = 5,
    todayOnly = false
): Promise<AppointmentPage> =>
    api.get<AppointmentPage>("/api/appointments", {
        params: {
            ...(status ? { status } : {}),
            ...(todayOnly ? { todayOnly: true } : {}),
            page,
            size
        },
    }).then((r) => r.data);

export const getCalendarAppointments = (): Promise<IAppointment[]> =>
    api.get<IAppointment[]>("/api/appointments/calendar").then((r) => r.data);

/** Liefert alle Termine (vergangen + zukünftig) des eingeloggten Kunden. Abgelehnte werden vom Backend ausgeblendet. */
export const getMyAppointments = (): Promise<IAppointment[]> =>
    api.get<IAppointment[]>("/api/appointments/my").then((r) => r.data);

/** Storniert einen eigenen Termin (Kunden-Selbstbedienung). */
export const cancelAppointment = (id: number): Promise<IAppointment> =>
    api.patch<IAppointment>(`/api/appointments/${id}/cancel`).then((r) => r.data);

/** Payload sent when a customer books a new appointment via the public booking form. */
export interface CreateAppointmentRequest {
    customerId: number | null;
    customerName: string;
    serviceType: string;
    offerId: number | null;
    serviceIds: number[];
    brand: string;
    model: string;
    year: number | null;
    licensePlate: string;
    date: string;
    time: string;
    preferredDate: string;
    note: string;
    price: number | null;
    durationMinutes: number;
    createdAt: string;
}

export const createAppointment = (
    body: CreateAppointmentRequest
): Promise<IAppointment> =>
    api.post<IAppointment>("/api/appointments", body).then((r) => r.data);

export const updateAppointmentStatus = (
    id: number,
    status: AppointmentStatus
): Promise<IAppointment> =>
    api.patch<IAppointment>(`/api/appointments/${id}/status`, { status })
        .then((r) => r.data);

export const deleteAppointment = (id: number): Promise<void> =>
    api.delete(`/api/appointments/${id}`).then(() => undefined);