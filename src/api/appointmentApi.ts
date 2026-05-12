
import api from "./api";
import { AppointmentStatus } from "../types/AppointmentStatus";
import { IAppointment } from "../interface/IAppointment";

/*
* NAME : Dominik Ranegger
* DATE : 14.04
* */

export type { AppointmentStatus };

export interface AppointmentPage {
    content: IAppointment[];
    totalPages: number;
    totalElements: number;
    number: number;
}

export const getAppointments = (
    status?: AppointmentStatus,
    page = 0,
    size = 5
): Promise<AppointmentPage> =>
    api.get<AppointmentPage>("/api/appointments", {
        params: { ...(status ? { status } : {}), page, size },
    }).then((r) => r.data);

export const createAppointment = (
    body: Omit<IAppointment, "id" | "status">
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