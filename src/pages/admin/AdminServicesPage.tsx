import {useEffect, useState} from "react";
import {createService, deleteService, getServices, IService, updateService} from "../../api/services.ts";
import "../../css/AdminServicePage.css";

interface ServiceFormProps {
    onSubmit: (e: React.FormEvent) => void;
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
                    onChange={onIconChange}
                />
            </div>
        </div>

        <label htmlFor="description">Untertitel</label>
        <input
            id="description"
            placeholder="Kurze Beschreibung"
            type="text"
            value={description}
            required
            onChange={e => setDescription(e.target.value)}
        />

        <label htmlFor="price">Preis *</label>
        <input
            id="price"
            placeholder="100"
            type="number"
            value={price}
            required
            onChange={e => setPrice(Number(e.target.value))}
        />

        <label htmlFor="duration">Dauer (Minuten) *</label>
        <input
            id="duration"
            placeholder="60"
            type="number"
            value={duration}
            onChange={e => setDuration(e.target.value === "" ? "" : Number(e.target.value))}
        />

        <div className="form-actions">
            <button type="button" onClick={onCancelClick}>Abbrechen</button>
            <button type="submit">Speichern</button>
        </div>
    </form>
);

export default function AdminServicesPage() {
    const [services, setServices] = useState<IService[]>([]);
    const [selectedServiceForEditing, setSelectedServiceForEditing] = useState<IService>();
    const [unfiltered, setUnfiltered] = useState<IService[]>([]);
    const [selectedForDeleting, setSelectedForDeleting] = useState<IService>();

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

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (duration === "" || duration === 0) {
            alert("Bitte geben Sie eine gültige Dauer an.");
            return;
        }

        if (!selectedServiceForEditing || selectedServiceForEditing.id === undefined) return;

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
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (duration === "" || duration === 0) {
            alert("Bitte geben Sie eine gültige Dauer an.");
            return;
        }

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
    };

    const onCancel = () => {
        setSelectedServiceForEditing(undefined);
        setIcon("");
        setTitle("");
        setDescription("");
        setPrice(0);
        setDuration(0);
    };

    const onAddCancel = () => {
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
        if (!selectedForDeleting?.id) return;

        await deleteService(selectedForDeleting.id);
        await reloadServices();

        setSelectedForDeleting(undefined);
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
            const serviceData = await getServices();
            setUnfiltered(serviceData);
            setServices(serviceData);
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
                            <th>Untertitel</th>
                            <th>Preis</th>
                            <th>Dauer</th>
                            <th>Aktionen</th>
                        </tr>
                        </thead>
                        <tbody>
                        {services.map(value => (
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
                        ))}
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
                                    <button onClick={() => setSelectedForDeleting(undefined)}>Abbrechen</button>
                                    <button onClick={wantsToDelete}>Löschen</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}