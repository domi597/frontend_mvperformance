import {useEffect, useState} from "react";
import {MOCK_TERMINE} from "../../mockdata/mock_data.ts";
import {ITermin} from "../../interface/ITermin.ts";
import "../../css/dashboard.css";
import {useNavigate} from "react-router-dom";

/*
* NAME : JAN HARKAMP
* DATE : 24.03
* */

export default function DashboardPage() {
  // Admin Dashboard: Statistik-Cards, offene Terminanfragen, aktuelle Angebote
    const [anfragenCounter, setAnfragenCounter] = useState<number>(0);
    const [termineHeute, setTermineHeute] = useState<number>(0);
    const [bewertungenCounter, setBewertungCounter] = useState<number>(612);

    const [termine, setTermine] = useState<ITermin[]>(MOCK_TERMINE);

    const navigate = useNavigate();

    useEffect(() => {
        const heute = new Date().toISOString().split("T")[0];

        const todayCount = termine.filter((t) => t.datum === heute).length;
        const newRequestCount = termine.filter((t) => t.status === "NEU").length

        setAnfragenCounter(newRequestCount);
        setTermineHeute(todayCount);
    }, [termine]);

    const onAccept = (terminId: number) => {
        setTermine((prev) =>
            prev.map((t) =>
                t.terminId === terminId
                    ? { ...t, status: "BESTAETIGT" }
                    : t
            )
        );
    };

    const onDecline = (terminId: number) => {
        setTermine((prev) =>
            prev.map((t) =>
                t.terminId === terminId
                    ? { ...t, status: "ABGELEHNT" }
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
                            <tr key={t.terminId}>
                                <td>{t.kundeName}</td>
                                <td>{t.leistung}</td>
                                <td>
                                    {t.marke} {t.modell} ({t.baujahr})
                                </td>
                                <td>
                                    {t.datum} · {t.uhrzeit}
                                </td>

                                {/* Status */}
                                <td>
                                    <span
                                        className={`badge ${
                                            t.status === "NEU"
                                                ? "blue"
                                                : t.status === "AUSSTEHEND"
                                                    ? "yellow"
                                                    : t.status === "BESTAETIGT"
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
                                                onClick={() => onAccept(t.terminId)}
                                            >
                                                Bestätigen
                                            </button>
                                            <button
                                                className="btn danger"
                                                onClick={() => onDecline(t.terminId)}
                                            >
                                                Ablehnen
                                            </button>
                                        </>
                                    ) : t.status === "BESTAETIGT" ? (
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
