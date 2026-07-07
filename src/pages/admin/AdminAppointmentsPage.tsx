import { useEffect, useState } from "react";
import "../../css/appointments.css";
import { IAppointment } from "../../interface/IAppointment";
import {getAppointments, updateAppointmentStatus} from "../../api/appointmentApi";
import { AppointmentStatus } from "../../types/AppointmentStatus";

type FilterType = "ALLE" | "HEUTE" | AppointmentStatus;

function AppointmentRowSkeleton() {
    return (
        <tr className="skeleton-row">
            <td><div className="skeleton-block skeleton-cell" style={{ width: "60%" }} /></td>
            <td><div className="skeleton-block skeleton-cell" style={{ width: "50%" }} /></td>
            <td><div className="skeleton-block skeleton-cell" style={{ width: "55%" }} /></td>
            <td><div className="skeleton-block skeleton-cell" style={{ width: "70%" }} /></td>
            <td><div className="skeleton-block skeleton-badge" /></td>
            <td>
                <div className="skeleton-actions-cell">
                    <div className="skeleton-block" />
                    <div className="skeleton-block" />
                </div>
            </td>
        </tr>
    );
}

function AdminAppointmentsPage() {
    const [termine, setTermine] = useState<IAppointment[]>([]);
    const [filter, setFilter] = useState<FilterType>("ALLE");
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const itemsPerPage = 5;

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                const backendPage = page - 1;
                const status =
                    filter === "ALLE" || filter === "HEUTE"
                        ? undefined
                        : (filter as AppointmentStatus);
                const todayOnly = filter === "HEUTE";

                const res = await getAppointments(status, backendPage, itemsPerPage, todayOnly);
                setTermine(res?.content ?? []);
                setTotalPages(res?.totalPages ?? 1);
            } catch (err) {
                console.error(err);
                setTermine([]);
                setTotalPages(1);
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, [filter, page]);

    const onAccept = async (id: number) => {
        try {
            await updateAppointmentStatus(id, "BESTÄTIGT");
            setTermine((prev) =>
                prev.map((t) => t.id === id ? { ...t, status: "BESTÄTIGT" } : t)
            );
        } catch (err) {
            console.error("Accept failed", err);
        }
    };

    const onDecline = async (id: number) => {
        try {
            await updateAppointmentStatus(id, "ABGELEHNT");
            setTermine((prev) =>
                prev.map((t) => t.id === id ? { ...t, status: "ABGELEHNT" } : t)
            );
        } catch (err) {
            console.error("Decline failed", err);
        }
    };

    const onComplete = async (id: number) => {
        try {
            await updateAppointmentStatus(id, "ABGESCHLOSSEN");
            setTermine((prev) =>
                prev.map((t) => t.id === id ? { ...t, status: "ABGESCHLOSSEN" } : t)
            );
        } catch (err) {
            console.error("Complete failed", err);
        }
    };

    const labelMap: Record<FilterType, string> = {
        ALLE: "Alle",
        HEUTE: "Heute",
        NEU: "Neu",
        AUSSTEHEND: "Ausstehend",
        BESTÄTIGT: "Bestätigt",
        ABGELEHNT: "Abgelehnt",
        ABGESCHLOSSEN: "Abgeschlossen",
        STORNIERT: "Storniert",
    };

    const statusClassMap: Record<AppointmentStatus, string> = {
        NEU: "blue",
        AUSSTEHEND: "yellow",
        BESTÄTIGT: "green",
        ABGELEHNT: "red",
        ABGESCHLOSSEN: "gray",
        STORNIERT: "gray",
    };

    const emptyLabel = filter === "HEUTE"
        ? "Heute stehen keine Termine an."
        : filter === "ALLE"
            ? "Es sind noch keine Termine vorhanden."
            : `Keine Termine mit Status „${labelMap[filter]}".`;

    return (
        <div className="main full">
            <h1>Termine</h1>

            <div className="tabs">
                {["ALLE", "HEUTE", "NEU", "AUSSTEHEND", "BESTÄTIGT", "ABGELEHNT", "ABGESCHLOSSEN", "STORNIERT"].map((f) => (
                    <button
                        key={f}
                        className={filter === f ? "tab active" : "tab"}
                        onClick={() => {
                            setFilter(f as FilterType);
                            setPage(1);
                        }}
                    >
                        {labelMap[f as FilterType]}
                    </button>
                ))}
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
                {isLoading ? (
                    Array.from({ length: itemsPerPage }).map((_, i) => (
                        <AppointmentRowSkeleton key={i} />
                    ))
                ) : termine.length === 0 ? (
                    <tr className="empty-row">
                        <td colSpan={6}>
                            <div className="empty-state">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" />
                                    <path d="M16 2v4" />
                                    <path d="M8 2v4" />
                                    <path d="M3 10h18" />
                                    <path d="m9.5 16 2 2 3-3" />
                                </svg>
                                <p>{emptyLabel}</p>
                            </div>
                        </td>
                    </tr>
                ) : (
                    termine.map((t) => (
                        <tr key={t.id}>
                            <td>{t.customerName}</td>
                            <td>{t.serviceType}</td>
                            <td>{t.brand} {t.model}</td>
                            <td>{t.date} · {t.time}</td>

                            <td>
                                <span className={`badge ${statusClassMap[t.status]}`}>
                                    {labelMap[t.status]}
                                </span>
                            </td>

                            <td>
                                <>
                                    {t.status !== "BESTÄTIGT" && t.status !== "ABGESCHLOSSEN" && t.status !== "STORNIERT" && (
                                        <button className="btn" onClick={() => onAccept(t.id)}>
                                            Bestätigen
                                        </button>
                                    )}
                                    {t.status !== "ABGELEHNT" && t.status !== "ABGESCHLOSSEN" && t.status !== "STORNIERT" && (
                                        <button className="btn danger" onClick={() => onDecline(t.id)}>
                                            Ablehnen
                                        </button>
                                    )}
                                    {t.status === "BESTÄTIGT" && (
                                        <button className="btn success" onClick={() => onComplete(t.id)}>
                                            Abschließen
                                        </button>
                                    )}
                                </>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

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

export default AdminAppointmentsPage;