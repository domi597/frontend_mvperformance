import { useEffect, useState } from "react";
import { fetchAppointments } from "../api/appointmentApi";

export function useNewAppointmentsCount(): number {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchAppointments("NEU", 0, 100);
                setCount(res?.totalElements ?? 0);
            } catch {
                setCount(0);
            }
        };

        load();
    }, []);

    return count;
}
