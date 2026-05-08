import { useEffect, useState } from "react";
import { fetchAppointments } from "../api/appointmentApi";

export function useNewAppointmentsCount(): number {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const load = async () => {
            try {
                const [neuRes, ausstehendRes] = await Promise.all([
                    fetchAppointments("NEU",        0, 1),
                    fetchAppointments("AUSSTEHEND", 0, 1),
                ]);

                const neu        = neuRes?.totalElements        ?? 0;
                const ausstehend = ausstehendRes?.totalElements ?? 0;

                setCount(neu + ausstehend);
            } catch {
                setCount(0);
            }
        };

        load();
    }, []);

    return count;
}

