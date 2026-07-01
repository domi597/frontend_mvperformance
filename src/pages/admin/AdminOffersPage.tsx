import { useEffect, useState } from "react";
import {createOffer, deleteOfferAPI, getOffers, IOffer, updateOffer} from "../../api/offers.ts";
import { getServices, IService } from "../../api/services.ts";
import "../../css/AdminOffers.css";

export default function AdminOffersPage() {
    const [offers, setOffers] = useState<IOffer[]>([]);
    const [services, setServices] = useState<IService[]>([]);

    const [offerToEdit, setOfferToEdit] = useState<IOffer>();
    const [offerToDelete, setOfferToDelete] = useState<IOffer>();
    const [isCreating, setIsCreating] = useState(false);

    const [title, setTitle] = useState("");
    const [icon, setIcon] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [duration, setDuration] = useState(0);
    const [status, setStatus] = useState(true);
    const [selectedServices, setSelectedServices] = useState<IService[]>([]);

    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                setOffers(await getOffers());
                setServices(await getServices());
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const onCreateClick = () => {
        setOfferToEdit(undefined);
        setIsCreating(true);
        setTitle("");
        setIcon("");
        setDescription("");
        setPrice(0);
        setDuration(0);
        setStatus(true);
        setSelectedServices([]);
    };

    const onEditClick = (offer: IOffer) => {
        setIsCreating(false);
        setOfferToEdit(offer);
        setTitle(offer.title);
        setIcon(offer.icon ?? "");
        setDescription(offer.description ?? "");
        setPrice(offer.price);
        setDuration(offer.duration ?? 0);
        setStatus(offer.active);
        setSelectedServices(offer.services);
    };

    const isSelected = (service: IService) =>
        selectedServices.some(s => s.id === service.id);

    const onServiceClick = (service: IService) => {
        setSelectedServices(prev =>
            prev.some(s => s.id === service.id)
                ? prev.filter(s => s.id !== service.id)
                : [...prev, service]
        );
    };

    const onCancelClick = () => {
        setOfferToEdit(undefined);
        setIsCreating(false);
        setTitle("");
        setIcon("");
        setDescription("");
        setPrice(0);
        setDuration(0);
        setStatus(true);
        setSelectedServices([]);
    };

    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setIcon((reader.result as string).split(",")[1]);
        reader.readAsDataURL(file);
    };

    const onSubmitClick = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSaving) return;

        setIsSaving(true);
        try {
            const body: Omit<IOffer, "id" | "createdAt"> = {
                icon,
                title,
                description,
                price,
                duration,
                active: status,
                services: selectedServices
            };

            if (isCreating) {
                await createOffer(body);
            } else if (offerToEdit) {
                await updateOffer(offerToEdit.id, body);
            }

            setOffers(await getOffers());
            onCancelClick();
        } catch (err) {
            console.log("AdminOffersPage.tsx : " + err);
            alert("Speichern fehlgeschlagen. Bitte versuche es erneut.");
        } finally {
            setIsSaving(false);
        }
    };

    const deleteOffer = async () => {
        if (!offerToDelete?.id || isDeleting) return;

        setIsDeleting(true);
        try {
            await deleteOfferAPI(offerToDelete.id);
            setOffers(prev => prev.filter(offer => offer.id !== offerToDelete.id));
            setOfferToDelete(undefined);
        } catch (err) {
            console.log("AdminOffersPage.tsx : " + err);
            alert("Löschen fehlgeschlagen. Bitte versuche es erneut.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            {offerToEdit || isCreating ? (
                <div className="edit-offer-container">
                    <form className="edit-offer-form" onSubmit={onSubmitClick}>
                        <h2>
                            {isCreating ? "Neues Angebot erstellen" : `${title} bearbeiten`}
                        </h2>

                        <label>Titel</label>
                        <input
                            required
                            value={title}
                            disabled={isSaving}
                            onChange={e => setTitle(e.target.value)}
                        />

                        <label htmlFor="offer-icon">Icon</label>
                        <label className="file-upload" htmlFor="offer-icon">Datei auswählen</label>
                        <input
                            id="offer-icon"
                            className="file-input"
                            type="file"
                            accept="image/*"
                            disabled={isSaving}
                            onChange={handleIconChange}
                        />
                        {icon && (
                            <img
                                src={`data:image/png;base64,${icon}`}
                                alt="icon preview"
                                className="icon-preview"
                            />
                        )}

                        <label>Beschreibung</label>
                        <textarea
                            value={description}
                            disabled={isSaving}
                            onChange={e => setDescription(e.target.value)}
                        />

                        <div className="price-status-row">
                            <div className="price-box">
                                <label>Preis (€)</label>
                                <input
                                    type="number"
                                    required
                                    value={price === 0 ? "" : price}
                                    disabled={isSaving}
                                    onChange={e => setPrice(e.target.value === "" ? 0 : Number(e.target.value))}
                                />
                            </div>

                            <div className="price-box">
                                <label>Dauer (min)</label>
                                <input
                                    type="number"
                                    required
                                    value={duration === 0 ? "" : duration}
                                    disabled={isSaving}
                                    onChange={e => setDuration(e.target.value === "" ? 0 : Number(e.target.value))}
                                />
                            </div>

                            <div className="status-box">
                                <label>Status</label>
                                <div className="status-container">
                                    <button
                                        type="button"
                                        className={status ? "status-btn active" : "status-btn"}
                                        disabled={isSaving}
                                        onClick={() => setStatus(true)}
                                    >
                                        ● Aktiv
                                    </button>
                                    <button
                                        type="button"
                                        className={!status ? "status-btn inactive" : "status-btn"}
                                        disabled={isSaving}
                                        onClick={() => setStatus(false)}
                                    >
                                        ● Inaktiv
                                    </button>
                                </div>
                            </div>
                        </div>

                        <label>Services zuweisen</label>
                        <div className="services-select">
                            {services.map(service => (
                                <button
                                    key={service.id}
                                    type="button"
                                    className={isSelected(service) ? "service-btn selected" : "service-btn"}
                                    disabled={isSaving}
                                    onClick={() => onServiceClick(service)}
                                >
                                    {service.title}
                                </button>
                            ))}
                        </div>

                        <div className="form-actions">
                            <button type="button" className="cancel-btn" disabled={isSaving} onClick={onCancelClick}>
                                Abbrechen
                            </button>
                            <button type="submit" className="save-btn" disabled={isSaving}>
                                {isSaving && <span className="btn-spinner" />}
                                {isSaving ? "Speichert..." : (isCreating ? "Hinzufügen" : "Speichern")}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="offers-page">
                    <div className="offers-header">
                        <h2>Aktuelle Angebote</h2>
                        <button className="new-offer-btn" onClick={onCreateClick}>
                            + Neues Angebot
                        </button>
                    </div>

                    <div className="offers-grid">
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div className="skeleton-card" key={i}>
                                    <div className="skeleton-block skeleton-icon" />
                                    <div className="skeleton-block skeleton-title" />
                                    <div className="skeleton-tags">
                                        <div className="skeleton-block skeleton-tag" />
                                        <div className="skeleton-block skeleton-tag" />
                                    </div>
                                    <div className="skeleton-block skeleton-price" />
                                    <div className="skeleton-block skeleton-status" />
                                    <div className="skeleton-actions">
                                        <div className="skeleton-block skeleton-btn" />
                                        <div className="skeleton-block skeleton-btn" />
                                    </div>
                                </div>
                            ))
                        ) : offers.length === 0 ? (
                            <div className="offers-empty">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 7H4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1Z" />
                                    <path d="M12 12v9" />
                                    <path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
                                    <path d="M12 7V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2" />
                                    <path d="M12 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                                </svg>
                                <p>Es sind noch keine Angebote vorhanden.</p>
                            </div>
                        ) : (
                            offers.map(offer => (
                                <div
                                    className="offer-card"
                                    key={offer.id}
                                    style={{ display: "flex", flexDirection: "column" }}
                                >
                                    {offer.icon && (
                                        <img
                                            src={`data:image/png;base64,${offer.icon}`}
                                            alt="icon"
                                            className="offer-icon"
                                        />
                                    )}

                                    <h3>{offer.title}</h3>

                                    <div className="service-tags">
                                        {offer.services.map(service => (
                                            <span key={service.id} className="service-tag">
                                                {service.title}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="offer-price">€ {offer.price}</div>

                                    {offer.duration != null && offer.duration > 0 && (
                                        <div className="offer-duration">⏱ {offer.duration} min</div>
                                    )}

                                    <span className={offer.active ? "status active" : "status inactive"}>
                                        ● {offer.active ? "Aktiv" : "Inaktiv"}
                                    </span>

                                    <div className="offer-actions" style={{ marginTop: "auto" }}>
                                        <button className="edit-btn" onClick={() => onEditClick(offer)}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                                <path d="M15 5l4 4" />
                                            </svg>
                                            Bearbeiten
                                        </button>
                                        <button className="delete-btn" onClick={() => setOfferToDelete(offer)}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 6h18" />
                                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                <line x1="10" y1="11" x2="10" y2="17" />
                                                <line x1="14" y1="11" x2="14" y2="17" />
                                            </svg>
                                            Löschen
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {offerToDelete && (
                <div className="modal-overlay">
                    <div className="delete-modal">
                        <div className="delete-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18" />
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                        </div>
                        <h2>Angebot löschen?</h2>
                        <p>
                            Möchtest du „{offerToDelete.title}" wirklich löschen?
                            Diese Aktion kann nicht rückgängig gemacht werden.
                        </p>
                        <div className="modal-actions">
                            <button type="button" disabled={isDeleting} onClick={() => setOfferToDelete(undefined)}>
                                Abbrechen
                            </button>
                            <button type="button" className="confirm-delete-btn" disabled={isDeleting} onClick={deleteOffer}>
                                {isDeleting && <span className="btn-spinner" />}
                                {isDeleting ? "Löscht..." : "Löschen"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
