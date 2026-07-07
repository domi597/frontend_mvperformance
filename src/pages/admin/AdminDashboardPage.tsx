import { useEffect, useMemo, useState } from "react";
import { IAppointment } from "../../interface/IAppointment";
import { AppointmentStatus } from "../../types/AppointmentStatus";
import "../../css/dashboard.css";
import { useNavigate } from "react-router-dom";
import {getAppointments, updateAppointmentStatus} from "../../api/appointmentApi";
import {getOffers, IOffer} from "../../api/offers.ts";

function StatCardSkeleton() {
    return (
        <div className="card">
            <div className="skeleton-block skeleton-line" style={{ width: "60%", height: "12px" }} />
            <div className="skeleton-block skeleton-line" style={{ width: "40%", height: "24px", marginTop: "10px" }} />
        </div>
    );
}

function AppointmentRowSkeleton() {
    return (
        <tr className="skeleton-row">
            <td><div className="skeleton-block skeleton-line" style={{ width: "70%" }} /></td>
            <td><div className="skeleton-block skeleton-line" style={{ width: "60%" }} /></td>
            <td><div className="skeleton-block skeleton-line" style={{ width: "80%" }} /></td>
            <td><div className="skeleton-block skeleton-line" style={{ width: "70%" }} /></td>
            <td><div className="skeleton-block skeleton-line" style={{ width: "50px" }} /></td>
            <td>
                <div className="skeleton-actions-cell">
                    <div className="skeleton-block skeleton-btn" />
                    <div className="skeleton-block skeleton-btn" />
                </div>
            </td>
        </tr>
    );
}

function OfferCardSkeleton() {
    return (
        <div className="dashboard-offer-card">
            <div className="skeleton-block skeleton-line" style={{ width: "70%", height: "16px" }} />
            <div className="skeleton-block skeleton-line" style={{ width: "50%", height: "24px", marginTop: "14px" }} />
            <div className="skeleton-block skeleton-line" style={{ width: "90%", height: "13px", marginTop: "8px" }} />
        </div>
    );
}

export default function AdminDashboardPage() {
    const [termine, setTermine] = useState<IAppointment[]>([]);
    const [offers, setOffers] = useState<IOffer[]>([])
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const heute = new Date().toLocaleDateString("sv-SE");

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                const res = await getAppointments(undefined, 0, 100);
                const offerData = await getOffers();

                const data: IAppointment[] = Array.isArray(res)
                    ? res
                    : res?.content ?? [];

                setOffers(offerData);
                setTermine(data);
            } catch (err) {
                console.error(err);
                setOffers([]);
                setTermine([]);
            } finally {
                setIsLoading(false);
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


    const topTermine = useMemo(
        () =>
            [...termine]
                .filter(
                    (t) =>
                        t.status === "NEU" ||
                        t.status === "AUSSTEHEND" ||
                        t.status === "BESTÄTIGT" ||
                        t.status === "ABGELEHNT"
                )
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

    const onComplete = async (id: number) => {
        try {
            await updateAppointmentStatus(id, "ABGESCHLOSSEN");

            setTermine((prev) =>
                prev.map((t) =>
                    t.id === id ? { ...t, status: "ABGESCHLOSSEN" } : t
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
            case "ABGESCHLOSSEN":
                return "gray";
            default:
                return "gray";
        }
    };

    return (
        <div className="main full">

            <div className="stats">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
                ) : (
                    <>
                        <div className="card">
                            <p>NEUE ANFRAGEN</p>
                            <h2>{anfragenCounter}</h2>
                        </div>

                        <div className="card">
                            <p>TERMINE HEUTE</p>
                            <h2>{termineHeute}</h2>
                        </div>

                        <div className="card">
                            <p>ANGEBOTE AKTIV</p>
                            <h2>{offers.length}</h2>
                        </div>
                    </>
                )}
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
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <AppointmentRowSkeleton key={i} />
                        ))
                    ) : topTermine.length === 0 ? (
                        <tr className="empty-row">
                            <td colSpan={6}>
                                <div className="empty-state">
                                    <p>Es sind keine offenen Terminanfragen vorhanden.</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        topTermine.map((t) => (
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
                                    <>
                                        {t.status !== "BESTÄTIGT" && t.status !== "ABGESCHLOSSEN" && (
                                            <button
                                                className="btn"
                                                onClick={() => onAccept(t.id)}
                                            >
                                                Bestätigen
                                            </button>
                                        )}

                                        {t.status !== "ABGELEHNT" && t.status !== "ABGESCHLOSSEN" && (
                                            <button
                                                className="btn danger"
                                                onClick={() => onDecline(t.id)}
                                            >
                                                Ablehnen
                                            </button>
                                        )}

                                        {t.status === "BESTÄTIGT" && (
                                            <button
                                                className="btn success"
                                                onClick={() => onComplete(t.id)}
                                            >
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


            </div>

            <div className="dashboard-offers-section">
                <div className="dashboard-offers-header">
                    <h2>Aktuelle Angebote</h2>
                    <button onClick={() => navigate("/admin/angebote")}>
                        Verwalten →
                    </button>
                </div>

                <div className="dashboard-offers-grid">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => <OfferCardSkeleton key={i} />)
                    ) : (
                        offers.map(offer => (
                            <div className="dashboard-offer-card" key={offer.id}>
                                <h3>{offer.title}</h3>

                                <p className="dashboard-offer-price">
                                    € {offer.price},-
                                </p>

                                <p className="dashboard-offer-services">
                                    {offer.services.map(service => service.title).join(" • ")}
                                </p>
                            </div>
                        ))
                    )}

                    {!isLoading && (
                        <button
                            className="dashboard-new-offer"
                            onClick={() => navigate("/admin/angebote")}
                        >
                            + Neues Angebot
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
