import { useState } from "react";
import "../../css/termine.css";
import { MOCK_TERMINE } from "../../mockdata/mock_data";
import { ITermin } from "../../interface/ITermin";

/*
* NAME : JAN HARKAMP
* DATE : 24.03
* */

export default function TerminePage() {
    const [termine, setTermine] = useState<ITermin[]>(MOCK_TERMINE);
    const [filter, setFilter] = useState<string>("ALLE");
    const [page, setPage] = useState<number>(1);

    const itemsPerPage = 5;

    const heute = new Date().toISOString().split("T")[0];

    // Aktionen
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

    // Filter + Sortierung
    const gefiltert = termine
        .filter((t) => {
            if (filter === "ALLE") return true;

            if (filter === "HEUTE") {
                return t.datum === heute && t.status !== "ABGELEHNT";
            }

            return t.status === filter;
        })
        .sort((a, b) => {
            const dateA = new Date(`${a.datum}T${a.uhrzeit}`);
            const dateB = new Date(`${b.datum}T${b.uhrzeit}`);
            return dateA.getTime() - dateB.getTime();
        });

    // Pagination
    const totalPages = Math.ceil(gefiltert.length / itemsPerPage);

    const paginated = gefiltert.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    // Labels für UI
    const labelMap: Record<string, string> = {
        ALLE: "Alle",
        HEUTE: "Heute",
        NEU: "Neu",
        AUSSTEHEND: "Ausstehend",
        BESTAETIGT: "Bestätigt",
        ABGELEHNT: "Abgelehnt",
    };

    return (
        <div className="main full">
            <h1>Termine</h1>

            {/* Tabs */}
            <div className="tabs">
                {["ALLE", "HEUTE", "NEU", "AUSSTEHEND", "BESTAETIGT", "ABGELEHNT"].map((f) => (
                    <button
                        key={f}
                        className={filter === f ? "tab active" : "tab"}
                        onClick={() => {
                            setFilter(f);
                            setPage(1);
                        }}
                    >
                        {labelMap[f]}
                    </button>
                ))}
            </div>

            {/* Tabelle */}
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
                {paginated.map((t) => (
                    <tr key={t.terminId}>
                        <td>{t.kundeName}</td>
                        <td>{t.leistung}</td>
                        <td>
                            {t.marke} {t.modell}
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
                  {labelMap[t.status]}
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
                                <span>-</span>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                        key={p}
                        className={page === p ? "page active" : "page"}
                        onClick={() => setPage(p)}
                    >
                        {p}
                    </button>
                ))}
            </div>
        </div>
    );
}