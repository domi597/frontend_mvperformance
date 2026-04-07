import { useState } from "react";
import "../../css/termine.css";
import {MOCK_TERMINE} from "../../mockdata/mock_data.ts";
import {ITermin} from "../../interface/ITermin.ts";

export default function TerminePage() {
    const [anfragenCounter] = useState<number>(3);
    const [termineHeute] = useState<number>(7);
    const [bewertungenCounter] = useState<number>(612);

    const [termine, setTermine] = useState<ITermin[]>(MOCK_TERMINE);

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
                    <span className="red">+ heute</span>
                </div>

                <div className="card">
                    <p>TERMINE HEUTE</p>
                    <h2>{termineHeute}</h2>
                    <span>2 noch offen</span>
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
                    <button>Alle ansehen →</button>
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
                                        <button className="btn">Bearbeiten</button>
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