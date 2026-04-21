import { useEffect, useMemo, useState } from "react";
import { IAppointment } from "../../interface/IAppointment";
import { AppointmentStatus } from "../../types/AppointmentStatus";
import "../../css/dashboard.css";
import { useNavigate } from "react-router-dom";
import {
    fetchAppointments,
    updateAppointmentStatus
} from "../../api/appointmentApi";

export default function DashboardPage() {
    const [termine, setTermine] = useState<IAppointment[]>([]);
    const navigate = useNavigate();

    const heute = new Date().toLocaleDateString("sv-SE");

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchAppointments(undefined, 0, 100);

                const data: IAppointment[] = Array.isArray(res)
                    ? res
                    : res?.content ?? [];

                setTermine(data);
            } catch (err) {
                console.error(err);
                setTermine([]);
            }
        };

        load();
    }, []);

    const anfragenCounter = useMemo(
        () => termine.filter((t) => t.status === "NEU").length,
        [termine]
    );

    const termineHeute = useMemo(
        () => termine.filter((t) => t.date === heute).length,
        [termine, heute]
    );

    const bewertungenCounter = 612;

    const topTermine = useMemo(
        () =>
            [...termine]
                .filter((t) => t.status === "NEU" || t.status === "AUSSTEHEND")
                .sort(
                    (a, b) =>
                        new Date(`${a.date}T${a.time}`).getTime() -
                        new Date(`${b.date}T${b.time}`).getTime()
                )
                .slice(0, 3),
        [termine]
    );

    const onAccept = async (id: number) => {
        try {
            await updateAppointmentStatus(id, "BESTÄTIGT");

            setTermine((prev) =>
                prev.map((t) =>
                    t.id === id ? { ...t, status: "BESTÄTIGT" } : t
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    const onDecline = async (id: number) => {
        try {
            await updateAppointmentStatus(id, "ABGELEHNT");

            setTermine((prev) =>
                prev.map((t) =>
                    t.id === id ? { ...t, status: "ABGELEHNT" } : t
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    const statusColor = (status: AppointmentStatus) => {
        switch (status) {
            case "NEU":
                return "blue";
            case "AUSSTEHEND":
                return "yellow";
            case "BESTÄTIGT":
                return "green";
            case "ABGELEHNT":
                return "red";
            default:
                return "gray";
        }
    };

    return (
        <div className="main full">

            <div className="stats">
                <div className="card">
                    <p>NEUE ANFRAGEN</p>
                    <h2>{anfragenCounter}</h2>
                </div>

                <div className="card">
                    <p>TERMINE HEUTE</p>
                    <h2>{termineHeute}</h2>
                </div>

                <div className="card">
                    <p>BEWERTUNGEN</p>
                    <h2>{bewertungenCounter}</h2>
                    <span className="yellow">★ 4.9</span>
                </div>

                <div className="card">
                    <p>ANGEBOTE AKTIV</p>
                    <h2>4</h2>
                    <span className="red">1 läuft ab</span>
                </div>
            </div>

            <div className="section">
                <div className="section-header">
                    <h2>Offene Terminanfragen</h2>
                    <button onClick={() => navigate("/admin/termine")}>
                        Alle ansehen →
                    </button>
                </div>

                <table className="table">
                    <thead>
                    <tr>
                        <th>Kunde</th>
                        <th>Leistung</th>
                        <th>Fahrzeug</th>
                        <th>Wunschtermin</th>
                        <th>Status</th>
                        <th>Aktionen</th>
                    </tr>
                    </thead>

                    <tbody>
                    {topTermine.map((t) => (
                        <tr key={t.id}>
                            <td>{t.customerName}</td>
                            <td>{t.serviceType}</td>
                            <td>{t.brand} {t.model} ({t.year})</td>
                            <td>{t.date} · {t.time}</td>

                            <td>
                                    <span className={`badge ${statusColor(t.status)}`}>
                                        {t.status}
                                    </span>
                            </td>

                            <td>
                                {t.status === "NEU" || t.status === "AUSSTEHEND" ? (
                                    <>
                                        <button
                                            className="btn"
                                            onClick={() => onAccept(t.id)}
                                        >
                                            Bestätigen
                                        </button>
                                        <button
                                            className="btn danger"
                                            onClick={() => onDecline(t.id)}
                                        >
                                            Ablehnen
                                        </button>
                                    </>
                                ) : (
                                    <span>-</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}