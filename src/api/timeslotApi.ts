import api from "./api";

/*
* NAME : Dominik Ranegger
* DATE : 22.05
* */

export interface ITimeslot {
    id: number;
    time: string; // "HH:mm:ss"
}

export const getTimeslots = (): Promise<ITimeslot[]> =>
    api.get<ITimeslot[]>("/api/timeslots").then((r) => r.data);

export const addTimeslot = (time: string): Promise<ITimeslot> =>
    api.post<ITimeslot>("/api/timeslots", null, {
        params: { time },
    }).then((r) => r.data);

export const deleteTimeslot = (id: number): Promise<void> =>
    api.delete(`/api/timeslots/${id}`).then(() => undefined);