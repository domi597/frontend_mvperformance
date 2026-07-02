import api from "./api";

/*
* NAME : Dominik Ranegger
* DATE : 22.05
* */

export interface ITimeslot {
    id: number;
    time: string; // "HH:mm:ss"
}

export const getTimeslots = (date: string, duration?: number): Promise<ITimeslot[]> =>
    api.post<ITimeslot[]>("/api/timeslots", null, {
        params: { date, ...(duration ? { duration } : {}) }
    }).then((r) => r.data);


export const deleteTimeslot = (id: number): Promise<void> =>
    api.delete(`/api/timeslots/${id}`).then(() => undefined);