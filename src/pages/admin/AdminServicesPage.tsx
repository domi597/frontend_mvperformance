import { useEffect, useState } from "react";
import { createService, deleteService, getServices, IService, updateService } from "../../api/services.ts";
import "../../css/AdminServicePage.css";

interface ServiceFormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onCancelClick: () => void;
    heading: string;
    title: string;
    setTitle: (v: string) => void;
    description: string;
    setDescription: (v: string) => void;
    price: number;
    setPrice: (v: number) => void;
    duration: number | "";
    setDuration: (v: number | "") => void;
    onIconChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isSaving: boolean;
}

const ServiceForm = ({
                         onSubmit,
                         onCancelClick,
                         heading,
                         title,
                         setTitle,
                         description,
                         setDescription,
                         price,
                         setPrice,
                         duration,
                         setDuration,
                         onIconChange,
                         isSaving,
                     }: ServiceFormProps) => (
    <form className="service-form" onSubmit={onSubmit}>
        <h2>{heading}</h2>

        <div className="form-row">
            <div>
                <label htmlFor="title">Titel *</label>
                <input
                    id="title"
                    placeholder="z.B. Ölwechsel"
                    type="text"
                    value={title}
                    required
                    disabled={isSaving}
                    onChange={e => setTitle(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="icon">Icon</label>
                <label className="file-upload" htmlFor="icon">Datei auswählen</label>
                <input
                    id="icon"
                    className="file-input"
                    type="file"
                    accept="image/*"
                    disabled={isSaving}
                    onChange={onIconChange}
                />
            </div>
        </div>

        <label htmlFor="description">Beschreibung</label>
        <input
            id="description"
            placeholder="Kurze Beschreibung"
            type="text"
            value={description}
            disabled={isSaving}
            onChange={e => setDescription(e.target.value)}
        />

        <label htmlFor="price">Preis *</label>
        <input
            id="price"
            placeholder="100"
            type="number"
            value={price === 0 ? "" : price}
            required
            disabled={isSaving}
            onChange={e => setPrice(e.target.value === "" ? 0 : Number(e.target.value))}
        />

        <label htmlFor="duration">Dauer (Minuten) *</label>
        <input
            id="duration"
            placeholder="60"
            type="number"
            value={duration}
            disabled={isSaving}
            onChange={e => setDuration(e.target.value === "" ? "" : Number(e.target.value))}
        />

        <div className="form-actions">
            <button type="button" disabled={isSaving} onClick={onCancelClick}>
                Abbrechen
            </button>
            <button type="submit" disabled={isSaving}>
                {isSaving && <span className="btn-spinner" />}
                {isSaving ? "Speichert..." : "Speichern"}
            </button>
        </div>
    </form>
);

function ServiceRowSkeleton() {
    return (
        <tr className="skeleton-row">
            <td><div className="skeleton-block skeleton-cell skeleton-id" /></td>
            <td><div className="skeleton-block skeleton-cell skeleton-icon" /></td>
            <td><div className="skeleton-block skeleton-cell" style={{ width: "70%" }} /></td>
            <td><div className="skeleton-block skeleton-cell" style={{ width: "80%" }} /></td>
            <td><div className="skeleton-block skeleton-cell" style={{ width: "50%" }} /></td>
            <td><div className="skeleton-block skeleton-cell" style={{ width: "50%" }} /></td>
            <td>
                <div className="skeleton-actions-cell">
                    <div className="skeleton-block" />
                    <div className="skeleton-block" />
                </div>
            </td>
        </tr>
    );
}

export default function AdminServicesPage() {
    const [services, setServices] = useState<IService[]>([]);
    const [selectedServiceForEditing, setSelectedServiceForEditing] = useState<IService>();
    const [unfiltered, setUnfiltered] = useState<IService[]>([]);
    const [selectedForDeleting, setSelectedForDeleting] = useState<IService>();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [title, setTitle] = useState("");
    const [icon, setIcon] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [duration, setDuration] = useState<number | "">(0);

    const [newServiceClicked, setNewServiceClicked] = useState(false);

    const reloadServices = async () => {
        const serviceData = await getServices();
        setUnfiltered(serviceData);
        setServices(serviceData);
    };

    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSaving) return;

        if (duration === "" || duration === 0) {
            alert("Bitte geben Sie eine gültige Dauer an.");
            return;
        }

        if (!selectedServiceForEditing || selectedServiceForEditing.id === undefined) return;

        setIsSaving(true);
        try {
            const updatedService: Omit<IService, "id"> = {
                icon,
                title,
                subtitle: description,
                price,
                duration: Number(duration),
            };

            await updateService(selectedServiceForEditing.id, updatedService);
            await reloadServices();

            setSelectedServiceForEditing(undefined);
            setIcon("");
            setTitle("");
            setDescription("");
            setPrice(0);
            setDuration(0);
        } catch (err) {
            console.log("AdminServicesPage.tsx : " + err);
            alert("Speichern fehlgeschlagen. Bitte versuche es erneut.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSaving) return;

        if (duration === "" || duration === 0) {
            alert("Bitte geben Sie eine gültige Dauer an.");
            return;
        }

        setIsSaving(true);
        try {
            const newService: Omit<IService, "id"> = {
                icon,
                title,
                subtitle: description,
                price,
                duration: Number(duration),
            };

            await createService(newService);
            await reloadServices();

            setNewServiceClicked(false);
            setIcon("");
            setTitle("");
            setDescription("");
            setPrice(0);
            setDuration(0);
        } catch (err) {
            console.log("AdminServicesPage.tsx : " + err);
            alert("Speichern fehlgeschlagen. Bitte versuche es erneut.");
        } finally {
            setIsSaving(false);
        }
    };

    const onCancel = () => {
        if (isSaving) return;
        setSelectedServiceForEditing(undefined);
        setIcon("");
        setTitle("");
        setDescription("");
        setPrice(0);
        setDuration(0);
    };

    const onAddCancel = () => {
        if (isSaving) return;
        setNewServiceClicked(false);
        setIcon("");
        setTitle("");
        setDescription("");
        setPrice(0);
        setDuration(0);
    };

    const updateSearch = (text: string) => {
        if (text === "") {
            setServices(unfiltered);
        } else {
            setServices(
                unfiltered.filter(v =>
                    v.title.toLowerCase().includes(text.toLowerCase())
                )
            );
        }
    };

    const handleNewServiceClick = () => {
        setSelectedServiceForEditing(undefined);
        setNewServiceClicked(true);
        setIcon("");
        setTitle("");
        setDescription("");
        setPrice(0);
        setDuration("");
    };

    const wantsToDelete = async () => {
        if (!selectedForDeleting?.id || isDeleting) return;

        setIsDeleting(true);
        try {
            await deleteService(selectedForDeleting.id);
            await reloadServices();
            setSelectedForDeleting(undefined);
        } catch (err) {
            console.log("AdminServicesPage.tsx : " + err);
            alert("Löschen fehlgeschlagen. Bitte versuche es erneut.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setIcon((reader.result as string).split(",")[1]);
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                const serviceData = await getServices();
                setUnfiltered(serviceData);
                setServices(serviceData);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    const sharedFormProps = {
        title,
        setTitle,
        description,
        setDescription,
        price,
        setPrice,
        duration,
        setDuration,
        onIconChange: handleIconChange,
        isSaving,
    };

    return (
        <div className="admin-services-page">
            <div className="admin-main">
                <div className="admin-header">
                    <h1>Leistungen</h1>
                    <button className="new-service-btn" onClick={handleNewServiceClick}>
                        + Neue Leistung
                    </button>
                </div>

                <div className="search-box">
                    <span>⌕</span>
                    <input
                        placeholder="Leistung suchen..."
                        onChange={e => updateSearch(e.target.value)}
                    />
                </div>

                <br/>

                <div className="table-card">
                    <table className="services-table">
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Icon</th>
                            <th>Titel</th>
                            <th>Beschreibung</th>
                            <th>Preis</th>
                            <th>Dauer</th>
                            <th>Aktionen</th>
                        </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <ServiceRowSkeleton key={i} />
                            ))
                        ) : services.length === 0 ? (
                            <tr className="empty-row">
                                <td colSpan={7}>
                                    <div className="empty-state">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 7H4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1Z" />
                                            <path d="M12 12v9" />
                                            <path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
                                            <path d="M12 7V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2" />
                                            <path d="M12 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                                        </svg>
                                        <p>Es sind noch keine Leistungen vorhanden.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            services.map(value => (
                                <tr key={value.id}>
                                    <td>{value.id}</td>
                                    <td>
                                        <img src={`data:image/png;base64,${value.icon}`} alt="icon"/>
                                    </td>
                                    <td>{value.title}</td>
                                    <td>{value.subtitle}</td>
                                    <td>{value.price} €</td>
                                    <td>{value.duration} min</td>
                                    <td>
                                        <button
                                            className="table-btn"
                                            onClick={() => {
                                                setSelectedServiceForEditing(value);
                                                setNewServiceClicked(false);
                                                setTitle(value.title);
                                                setIcon(value.icon);
                                                setDescription(value.subtitle ?? "");
                                                setPrice(value.price);
                                                setDuration(value.duration ?? 0);
                                            }}
                                        >
                                            Bearbeiten
                                        </button>
                                        <button
                                            className="table-btn delete-small-btn"
                                            onClick={() => setSelectedForDeleting(value)}
                                        >
                                            Löschen
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {(selectedServiceForEditing || newServiceClicked || selectedForDeleting) && (
                    <div className="modal-overlay">
                        {selectedServiceForEditing && (
                            <ServiceForm
                                {...sharedFormProps}
                                onSubmit={handleEditSubmit}
                                onCancelClick={onCancel}
                                heading="Service bearbeiten"
                            />
                        )}
                        {newServiceClicked && (
                            <ServiceForm
                                {...sharedFormProps}
                                onSubmit={handleAddSubmit}
                                onCancelClick={onAddCancel}
                                heading="Neue Leistung hinzufügen"
                            />
                        )}
                        {selectedForDeleting && (
                            <div className="delete-box">
                                <h2>Leistung löschen?</h2>
                                <p>
                                    Willst du "{selectedForDeleting.title}" wirklich löschen?
                                    Diese Aktion kann nicht rückgängig gemacht werden.
                                </p>
                                <div className="delete-actions">
                                    <button disabled={isDeleting} onClick={() => setSelectedForDeleting(undefined)}>
                                        Abbrechen
                                    </button>
                                    <button disabled={isDeleting} onClick={wantsToDelete}>
                                        {isDeleting && <span className="btn-spinner" />}
                                        {isDeleting ? "Löscht..." : "Löschen"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
