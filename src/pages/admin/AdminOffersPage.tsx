import { useEffect, useState } from "react";
import {
    createOffer,
    deleteOfferAPI,
    getOffers,
    IOffer,
    updateOffer
} from "../../api/offers.ts";
import { getServices, IService } from "../../api/services.ts";
import "../../css/AdminOffers.css";

export default function AdminOffersPage() {
    const [offers, setOffers] = useState<IOffer[]>([]);
    const [services, setServices] = useState<IService[]>([]);

    const [offerToEdit, setOfferToEdit] = useState<IOffer>();
    const [offerToDelete, setOfferToDelete] = useState<IOffer>();
    const [isCreating, setIsCreating] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [duration, setDuration] = useState(0);
    const [status, setStatus] = useState(true);
    const [selectedServices, setSelectedServices] = useState<IService[]>([]);

    useEffect(() => {
        const loadData = async () => {
            setOffers(await getOffers());
            setServices(await getServices());
        };

        loadData();
    }, []);

    const onCreateClick = () => {
        setOfferToEdit(undefined);
        setIsCreating(true);

        setTitle("");
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
        setDescription(offer.description);
        setPrice(offer.price);
        setDuration(offer.duration ?? 0);
        setStatus(offer.active);
        setSelectedServices(offer.services);
    };

    const isSelected = (service: IService) => {
        return selectedServices.some(s => s.id === service.id);
    };

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
        setDescription("");
        setPrice(0);
        setDuration(0);
        setStatus(true);
        setSelectedServices([]);
    };

    const onSubmitClick = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const body: Omit<IOffer, "id" | "createdAt"> = {
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
    };

    const deleteOffer = async () => {
        if (!offerToDelete?.id) return;

        await deleteOfferAPI(offerToDelete.id);

        setOffers(prev =>
            prev.filter(offer => offer.id !== offerToDelete.id)
        );

        setOfferToDelete(undefined);
    };

    return (
        <>
            {offerToEdit || isCreating ? (
                <div className="edit-offer-container">
                    <form
                        className="edit-offer-form"
                        onSubmit={onSubmitClick}
                    >
                        <h2>
                            {isCreating
                                ? "Neues Angebot erstellen"
                                : `${title} bearbeiten`}
                        </h2>

                        <label>Titel</label>
                        <input
                            required
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />

                        <label>Beschreibung</label>
                        <textarea
                            required
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />

                        <div className="price-status-row">
                            <div className="price-box">
                                <label>Preis (€)</label>
                                <input
                                    type="number"
                                    required
                                    value={price === 0 ? "" : price}
                                    onChange={e => {
                                        if (e.target.value === "") {
                                            setPrice(0);
                                        } else {
                                            setPrice(Number(e.target.value));
                                        }
                                    }}
                                />
                            </div>

                            {/* NEU */}
                            <div className="price-box">
                                <label>Dauer (min)</label>
                                <input
                                    type="number"
                                    required
                                    value={duration === 0 ? "" : duration}
                                    onChange={e => {
                                        if (e.target.value === "") {
                                            setDuration(0);
                                        } else {
                                            setDuration(Number(e.target.value));
                                        }
                                    }}
                                />
                            </div>

                            <div className="status-box">
                                <label>Status</label>

                                <div className="status-container">
                                    <button
                                        type="button"
                                        className={
                                            status
                                                ? "status-btn active"
                                                : "status-btn"
                                        }
                                        onClick={() => setStatus(true)}
                                    >
                                        ● Aktiv
                                    </button>

                                    <button
                                        type="button"
                                        className={
                                            !status
                                                ? "status-btn inactive"
                                                : "status-btn"
                                        }
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
                                    className={
                                        isSelected(service)
                                            ? "service-btn selected"
                                            : "service-btn"
                                    }
                                    onClick={() => onServiceClick(service)}
                                >
                                    {service.title}
                                </button>
                            ))}
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={onCancelClick}
                            >
                                Abbrechen
                            </button>

                            <button
                                type="submit"
                                className="save-btn"
                            >
                                {isCreating ? "Hinzufügen" : "Speichern"}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="offers-page">
                    <div className="offers-header">
                        <h2>Aktuelle Angebote</h2>

                        <button
                            className="new-offer-btn"
                            onClick={onCreateClick}
                        >
                            + Neues Angebot
                        </button>
                    </div>

                    <div className="offers-grid">
                        {offers.map(offer => (
                            <div className="offer-card" key={offer.id}>
                                <h3>{offer.title}</h3>

                                <div className="service-tags">
                                    {offer.services.map(service => (
                                        <span
                                            key={service.id}
                                            className="service-tag"
                                        >
                                            {service.title}
                                        </span>
                                    ))}
                                </div>

                                <div className="offer-price">
                                    € {offer.price}
                                </div>

                                {/* NEU */}
                                {offer.duration && (
                                    <div className="offer-duration">
                                        ⏱ {offer.duration} min
                                    </div>
                                )}

                                <span
                                    className={
                                        offer.active
                                            ? "status active"
                                            : "status inactive"
                                    }
                                >
                                    ● {offer.active ? "Aktiv" : "Inaktiv"}
                                </span>

                                <div className="offer-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={() => onEditClick(offer)}
                                    >
                                        ✏ Bearbeiten
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={() => setOfferToDelete(offer)}
                                    >
                                        🗑 Löschen
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {offerToDelete && (
                <div className="modal-overlay">
                    <div className="delete-modal">
                        <div className="delete-icon">🗑</div>

                        <h2>Angebot löschen?</h2>

                        <p>
                            Möchtest du „{offerToDelete.title}" wirklich löschen?
                            Diese Aktion kann nicht rückgängig gemacht werden.
                        </p>

                        <div className="modal-actions">
                            <button
                                type="button"
                                onClick={() => setOfferToDelete(undefined)}
                            >
                                Abbrechen
                            </button>

                            <button
                                type="button"
                                className="confirm-delete-btn"
                                onClick={deleteOffer}
                            >
                                Löschen
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}