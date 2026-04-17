import {useMemo, useState} from "react";
import {MOCK_TERMINE} from "../../mockdata/mock_data.ts";
import {IAppointment} from "../../interface/IAppointment.ts";
import {AppointmentStatus} from "../../types/AppointmentStatus.ts";
import "../../css/dashboard.css";
import {useNavigate} from "react-router-dom";

/*
* NAME : JAN HARKAMP
* DATE : 24.03
* */

export default function DashboardPage() {
  // Admin Dashboard: Statistik-Cards, offene Terminanfragen, aktuelle Angebote
    const [termine, setTermine] = useState<IAppointment[]>(MOCK_TERMINE);

    const navigate = useNavigate();

    const heute = new Date().toISOString().split("T")[0];
    const anfragenCounter = useMemo(() => termine.filter((t) => t.status === "NEU").length, [termine]);
    const termineHeute = useMemo(() => termine.filter((t) => t.date === heute).length, [termine, heute]);
    const bewertungenCounter = 612;

    const onAccept = (id: number) => {
        setTermine((prev) =>
            prev.map((t): IAppointment =>
               t.id === id
                    ? { ...t, status: "BESTÄTIGT" as AppointmentStatus }
                    : t
            )
        );
    };

    const onDecline = (id: number) => {
        setTermine((prev) =>
            prev.map((t): IAppointment =>
                t.id === id
                    ? { ...t, status: "ABGELEHNT" as AppointmentStatus }
                    : t
            )
        );
    };

    return (
        <div className="main full">


            {/* Stats */}
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

            {/* Tabelle */}
            <div className="section">
                <div className="section-header">
                    <h2>Offene Terminanfragen</h2>
                    <button onClick={() => navigate("/admin/termine")}>Alle ansehen →</button>
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
                    {
                        termine.map((t) => (
                            <tr key={t.id}>
                                <td>{t.customerName}</td>
                                <td>{t.serviceType}</td>
                                <td>
                                    {t.brand} {t.model} ({t.year})
                                </td>
                                <td>
                                    {t.date} · {t.time}
                                </td>

                                {/* Status */}
                                <td>
                                    <span
                                        className={`badge ${
                                            t.status === "NEU"
                                                ? "blue"
                                                : t.status === "AUSSTEHEND"
                                                    ? "yellow"
                                                    : t.status === "BESTÄTIGT"
                                                        ? "green"
                                                        : "red"
                                        }`}
                                    >
                                        {t.status}
                                    </span>
                                </td>

                                {/* Aktionen */}
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
                                    ) : t.status === "BESTÄTIGT" ? (
                                        <span>-</span>
                                    ) : (
                                        <span>-</span> // bei ABGELEHNT nix mehr anzeigen
                                    )}
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </div>
    );
}
