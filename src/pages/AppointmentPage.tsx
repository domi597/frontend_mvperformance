import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Container, Divider, Grid, Snackbar, Stack, Step, StepLabel, Stepper, TextField, Typography,} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AuthService from "../service/AuthService";
import { createAppointment } from "../api/appointmentApi";
import { getServices, IService } from "../api/services";
import { getOfferById, IOffer } from "../api/offers";
import { getTimeslots, ITimeslot } from "../api/timeslotApi";
import { getVehiclesByUser } from "../api/vehicleApi";
import type { IVehicle } from "../interface/IVehicle";
import { isValidAustrianPlate, isValidBuildYear, sanitizePlateInput } from "../utils/validation";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

/** Sentinel-Wert für "eigenes/neues Fahrzeug eingeben" in der Fahrzeugauswahl. */
const NEW_VEHICLE = "new" as const;

const STEPS = ["Leistung wählen", "Termin wählen", "Ihre Daten", "Bestätigung"];

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    brand: string;
    model: string;
    buildYear: string;
    licensePlate: string;
    date: string;
    time: string;
    note: string;
}

export default function AppointmentPage() {
    const customer   = AuthService.getKunde();
    const isLoggedIn = AuthService.isLoggedIn();
    const location    = useLocation();

    /** Service id passed in when arriving via a "Termin anfragen" button on a specific service (e.g. from the homepage or services list). */
    const preselectedServiceId = (location.state as { serviceId?: number } | null)?.serviceId;
    const [autoSelectApplied, setAutoSelectApplied] = useState(false);

    /** Offer id passed in when arriving via a "Termin anfragen" button on the offers page. */
    const preselectedOfferId = (location.state as { offerId?: number } | null)?.offerId;
    const [autoOfferApplied, setAutoOfferApplied] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<IOffer | null>(null);

    const [activeStep, setActiveStep]             = useState(0);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [selectedTime, setSelectedTime]         = useState("");
    const [submitted, setSubmitted]             = useState(false);
    const [loading, setLoading]                 = useState(false);
    const [errorMsg, setErrorMsg]               = useState<string | null>(null);
    const [snackbar, setSnackbar]               = useState<string | null>(null);

    const [services, setServices]     = useState<IService[]>([]);
    const [timeslots, setTimeslots]   = useState<ITimeslot[]>([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [dataError, setDataError]   = useState<string | null>(null);

    /** Gespeicherte Fahrzeuge des angemeldeten Kunden, zur Auswahl in Schritt "Ihre Daten". */
    const [vehicles, setVehicles]         = useState<IVehicle[]>([]);
    const [vehiclesLoading, setVehiclesLoading] = useState(false);
    /** Ausgewähltes Fahrzeug: eine Fahrzeug-ID (vorhandenes Fahrzeug) oder NEW_VEHICLE (manuell eingeben). */
    const [selectedVehicleId, setSelectedVehicleId] = useState<number | typeof NEW_VEHICLE | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const svcs = await getServices();
                setServices(svcs);
            } catch {
                setDataError("Leistungen und Zeitslots konnten nicht geladen werden. Bitte Seite neu laden.");
            } finally {
                setDataLoading(false);
            }
        };
        fetchData();

    }, []);

    /**
     * Lädt die gespeicherten Fahrzeuge des angemeldeten Kunden, sobald dieser
     * bekannt ist. Ist bereits mindestens ein Fahrzeug vorhanden, wird es
     * automatisch vorausgewählt; ansonsten fällt die Auswahl auf "Neues
     * Fahrzeug eingeben" zurück.
     */
    useEffect(() => {
        if (!isLoggedIn || !customer?.id) {
            setSelectedVehicleId(NEW_VEHICLE);
            return;
        }

        setVehiclesLoading(true);
        getVehiclesByUser(customer.id)
            .then((list) => {
                setVehicles(list);
                setSelectedVehicleId(list.length > 0 ? list[0].id : NEW_VEHICLE);
            })
            .catch(() => {
                setSelectedVehicleId(NEW_VEHICLE);
            })
            .finally(() => setVehiclesLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, customer?.id]);

    /**
     * Once the service list has loaded, pre-selects the service the user
     * came from (if any) and jumps straight to the "Termin wählen" step,
     * skipping the manual service-selection step. Wird übersprungen, wenn
     * bereits ein Angebot vorausgewählt wurde.
     *
     * Adjusted directly during render (React-recommended pattern for "run once
     * when data becomes available") instead of in an Effect, guarded by
     * `autoSelectApplied` so it only ever fires a single time.
     */
    if (!autoSelectApplied && preselectedOfferId == null && preselectedServiceId != null && services.length > 0) {
        const match = services.find((s) => s.id === preselectedServiceId);
        if (match) {
            setSelectedServices([match.title]);
            setActiveStep(1);
        }
        setAutoSelectApplied(true);
    }

    /**
     * Wenn die Terminanfrage über ein Angebot ("Termin anfragen" auf der
     * Angebote-Seite) ausgelöst wurde, werden die im Angebot enthaltenen
     * Leistungen und der Angebotspreis direkt übernommen und der Nutzer
     * springt sofort zum Schritt "Termin wählen" (Datum/Uhrzeit).
     */
    useEffect(() => {
        if (autoOfferApplied || preselectedOfferId == null) return;

        getOfferById(preselectedOfferId)
            .then((offer) => {
                setSelectedOffer(offer);
                setSelectedServices(offer.services.map((s) => s.title));
                setActiveStep(1);
            })
            .catch(() => {
                setDataError("Angebot konnte nicht geladen werden. Bitte Seite neu laden.");
            })
            .finally(() => {
                setAutoOfferApplied(true);
            });
    }, [autoOfferApplied, preselectedOfferId]);


    const fetchTimeslots = async (date: string, duration: number) => {
        const slots: ITimeslot[] = await getTimeslots(date, duration || 30);

        setTimeslots(slots);
    }

    const [form, setForm] = useState<FormData>({
        firstName:    customer?.firstName ?? "",
        lastName:     customer?.lastName  ?? "",
        email:        customer?.email     ?? "",
        phone:        customer?.phone     ?? "",
        brand:        "",
        model:        "",
        buildYear:    "",
        licensePlate: "",
        date: "",
        time: "",
        note: "",
    });

    /**
     * Returns a change handler for a given form field.
     * Avoids creating separate handler functions for each TextField.
     */
    const set = (field: keyof FormData) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setForm((prev) => ({ ...prev, [field]: e.target.value }));

    /** True, wenn ein bereits gespeichertes Fahrzeug (statt "Neues Fahrzeug") ausgewählt ist. */
    const isExistingVehicleSelected = typeof selectedVehicleId === "number";

    /** Wählt eines der gespeicherten Fahrzeuge aus und übernimmt dessen Daten in das Formular. */
    const selectVehicle = (vehicle: IVehicle) => {
        setSelectedVehicleId(vehicle.id);
        setForm((prev) => ({
            ...prev,
            brand: vehicle.brand,
            model: vehicle.model,
            buildYear: vehicle.buildYear != null ? String(vehicle.buildYear) : "",
            licensePlate: vehicle.licensePlate ?? "",
        }));
    };

    /** Wechselt zur manuellen Eingabe eines neuen Fahrzeugs und leert die Fahrzeugfelder. */
    const selectNewVehicle = () => {
        setSelectedVehicleId(NEW_VEHICLE);
        setForm((prev) => ({ ...prev, brand: "", model: "", buildYear: "", licensePlate: "" }));
    };

    /**
     * Determines whether the user may advance to the next step.
     * Each step has its own required fields that must be filled.
     */
    const canGoNext = (): boolean => {
        if (activeStep === 0) return selectedServices.length > 0;
        if (activeStep === 1) return !!form.date && !!selectedTime;
        if (activeStep === 2) {
            if (!(form.firstName && form.lastName && form.email && form.phone)) return false;
            // Bei einem bereits gespeicherten Fahrzeug sind die Fahrzeugdaten schon vollständig.
            if (isExistingVehicleSelected) return true;
            return !!(form.brand && form.model && form.licensePlate &&
                isValidAustrianPlate(form.licensePlate) && form.licensePlate.trim() !== "");
        }
        return true;
    };

    /**
     * Advances to the next step. On step 2 (customer data), the selected
     * timeslot is written into the form state before advancing.
     */
    const handleNext = () => {
        if (activeStep === 2) setForm((p) => ({ ...p, time: selectedTime }));
        setActiveStep((s) => s + 1);
    };

    const handleBack = () => setActiveStep((s) => s - 1);

    /**
     * Toggles a service in the multi-select. Services can be added or
     * removed from the selection by clicking their card again. Eine manuelle
     * Anpassung verlässt den Fixpreis eines vorausgewählten Angebots, da die
     * Auswahl dann nicht mehr dem Angebot entspricht.
     */
    const toggleService = (title: string) => {
        setSelectedOffer(null);
        setSelectedServices((prev) =>
            prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
        );
    };

    /**
     * The full service objects (incl. price/duration) belonging to the
     * currently selected service titles.
     */
    const selectedServiceObjects = services.filter((s) => selectedServices.includes(s.title));

    /** IDs der ausgewählten Leistungen – bevorzugt aus dem Angebot, sonst aus der freien Auswahl. */
    const selectedServiceIds: number[] = selectedOffer
        ? selectedOffer.services.map((s) => s.id).filter((id): id is number => id != null)
        : selectedServiceObjects.map((s) => s.id).filter((id): id is number => id != null);

    /** Angebotspreis, falls über ein Angebot gebucht wird, sonst Summe der Einzelleistungen. */
    const totalPrice = selectedOffer
        ? selectedOffer.price
        : selectedServiceObjects.reduce((sum, s) => sum + (s.price ?? 0), 0);

    /** Angebotsdauer, falls über ein Angebot gebucht wird, sonst Summe der Einzelleistungen. */
    const totalDuration = selectedOffer && selectedOffer.duration
        ? selectedOffer.duration
        : selectedServiceObjects.reduce((sum, s) => sum + (s.duration ?? 0), 0);

    /** Formats a Euro amount, e.g. 89 -> "89,00 €". */
    const formatPrice = (value: number) =>
        value.toLocaleString("de-AT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

    /** Formats a duration in minutes as "1 Std. 30 Min." / "45 Min.". */
    const formatDuration = (minutes: number) => {
        if (!minutes || minutes <= 0) return "–";
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        if (h === 0) return `${m} Min.`;
        if (m === 0) return `${h} Std.`;
        return `${h} Std. ${m} Min.`;
    };

    /** Formatiert einen Zeitslot als belegten Bereich, z.B. "13:30 – 14:10". */
    const formatSlotRange = (start: string, durationMinutes: number) => {
        if (!durationMinutes || durationMinutes <= 0) return start;
        const [h, m] = start.split(":").map(Number);
        const startTotal = h * 60 + m;
        const endTotal = startTotal + durationMinutes;
        const endH = Math.floor(endTotal / 60) % 24;
        const endM = endTotal % 60;
        const endStr = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
        return `${start} – ${endStr}`;
    };

    /**
     * Submits the appointment request to the backend.
     * Builds the `preferredDate` string from the selected date and time,
     * then calls the API. On success the success screen is shown; on failure
     * an inline error message is displayed.
     */
    const handleSubmit = async () => {
        setLoading(true);
        setErrorMsg(null);

        try {
            const preferredDate = `${form.date}T${selectedTime}:00`;

            await createAppointment({
                customerId:   customer?.id ?? null,
                customerName: `${form.firstName} ${form.lastName}`,
                serviceType:  selectedServices.join(", "),
                offerId:      selectedOffer?.id ?? null,
                serviceIds:   selectedServiceIds,
                vehicleId:    isExistingVehicleSelected ? (selectedVehicleId as number) : null,
                brand:        form.brand,
                model:        form.model,
                year:         form.buildYear ? parseInt(form.buildYear) : null,
                licensePlate: form.licensePlate,
                date:         form.date,
                time:         selectedTime,
                preferredDate,
                note:         form.note,
                price:          totalPrice,
                durationMinutes: totalDuration || 30,
                createdAt:    new Date().toISOString(),
            });

            setSubmitted(true);
            setSnackbar("Ihr Termin wurde erfolgreich angefragt!");
        } catch (err: unknown) {
            const responseData = isAxiosError<{ message?: string }>(err)
                ? err.response?.data
                : undefined;
            const msg =
                responseData?.message ??
                responseData ??
                "Fehler beim Senden der Terminanfrage. Bitte versuchen Sie es erneut.";
            setErrorMsg(typeof msg === "string" ? msg : JSON.stringify(msg));
            // Der gewählte Slot könnte inzwischen von jemand anderem gebucht worden sein (409 Conflict) –
            // in dem Fall die Zeitslots für das gewählte Datum neu laden, damit die Liste aktuell bleibt.
            if (isAxiosError(err) && err.response?.status === 409 && form.date) {
                fetchTimeslots(form.date, totalDuration || 30).catch(() => undefined);
                setSelectedTime("");
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Returns true when the given timeslot lies in the past or is the current minute.
     * The backend delivers time values as "HH:mm:ss"; only the first five characters
     * ("HH:mm") are used to build the comparable Date object.
     *
     * @param date - ISO date string (YYYY-MM-DD)
     * @param time - Time string from the backend, either "HH:mm:ss" or "HH:mm"
     */
    const isSlotInPast = (date: string, time: string) => {
        const timeShort = time.substring(0, 5);
        const slotDateTime = new Date(`${date}T${timeShort}`);
        return slotDateTime <= new Date();
    };

    const StepService = (
        <Box>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                Welche Leistung benötigen Sie?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Wählen Sie eine oder mehrere Leistungen aus unserem Angebot.
            </Typography>

            {dataLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : dataError ? (
                <Alert severity="error">{dataError}</Alert>
            ) : services.length === 0 ? (
                <Typography color="text.secondary">Keine Leistungen verfügbar.</Typography>
            ) : (
                <Grid container spacing={2}>
                    {services.map((s) => (
                        <Grid key={s.id ?? s.title} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card
                                variant="outlined"
                                onClick={() => toggleService(s.title)}
                                sx={{
                                    cursor: "pointer",
                                    borderColor: selectedServices.includes(s.title) ? "primary.main" : "divider",
                                    bgcolor:     selectedServices.includes(s.title) ? "rgba(198,40,40,0.07)" : "background.paper",
                                    transition:  "border-color 150ms, background-color 150ms",
                                    "&:hover": { borderColor: "primary.light" },
                                }}
                            >
                                <CardContent>
                                    <Typography variant="subtitle1" fontWeight={700}>{s.title}</Typography>
                                    {s.subtitle && (
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                            {s.subtitle}
                                        </Typography>
                                    )}

                                    {(typeof s.price === "number" || (typeof s.duration === "number" && s.duration > 0)) && (
                                        <>
                                            <Divider sx={{ my: 1.5 }} />
                                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                {typeof s.duration === "number" && s.duration > 0 ? (
                                                    <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
                                                        <AccessTimeIcon sx={{ fontSize: 16 }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            ca. {formatDuration(s.duration)}
                                                        </Typography>
                                                    </Stack>
                                                ) : <span />}
                                                {typeof s.price === "number" && (
                                                    <Typography variant="subtitle1" fontWeight={800} color="primary.main">
                                                        {formatPrice(s.price)}
                                                    </Typography>
                                                )}
                                            </Stack>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );

    const StepDateTime = (
        <Box>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                Wählen Sie Datum &amp; Uhrzeit
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Wählen Sie einen freien Termin aus. Sie können das Datum auch direkt eingeben.
                {totalDuration > 0 && (
                    <> Geschätzte Dauer: <strong>{formatDuration(totalDuration)}</strong>.</>
                )}
            </Typography>
            <Stack spacing={3}>
                <DatePicker
                    label="Datum"
                    value={form.date ? dayjs(form.date) : null}
                    onChange={(newValue) =>
                    {
                        const newDate = newValue ? newValue.format("YYYY-MM-DD") : "";

                        setForm((prev) => ({
                            ...prev,
                            date: newDate,
                        }));
                        setSelectedTime("");

                        if (newDate) {
                            fetchTimeslots(newDate, totalDuration || 30);
                        } else {
                            setTimeslots([]);
                        }
                    }
                    }
                    format="DD.MM.YYYY"
                    disablePast
                    slotProps={{
                        textField: {
                            fullWidth: true,
                        },
                    }}
                />
                {form.date && (
                    <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                            Verfügbare Zeitslots für{" "}
                            <strong>
                                {new Date(form.date).toLocaleDateString("de-AT", { day: "2-digit", month: "2-digit", year: "numeric" })}
                            </strong>
                        </Typography>

                        {dataLoading ? (
                            <CircularProgress size={24} />
                        ) : dataError ? (
                            <Alert severity="error">{dataError}</Alert>
                        ) : timeslots.length === 0 ? (
                            <Typography color="text.secondary">Keine Zeitslots verfügbar.</Typography>
                        ) : (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {timeslots.map((slot) => {
                                    const timeShort = slot.time.substring(0, 5);
                                    const disable = isSlotInPast(form.date, slot.time);

                                    return (
                                        <Chip
                                            key={slot.id}
                                            label={formatSlotRange(timeShort, totalDuration)}
                                            onClick={() => !disable && setSelectedTime(timeShort)}
                                            variant={selectedTime === timeShort ? "filled" : "outlined"}
                                            color={selectedTime === timeShort ? "primary" : "default"}
                                            disabled={disable}
                                            sx={{ cursor: disable ? "not-allowed" : "pointer" }}
                                        />
                                    );
                                })}
                            </Box>
                        )}
                    </Box>
                )}
            </Stack>
        </Box>
    );

    const StepCustomerData = (
        <Box>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                Ihre Daten
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {isLoggedIn
                    ? "Ihre gespeicherten Daten wurden automatisch eingetragen. Sie können diese anpassen."
                    : "Bitte füllen Sie Ihre Kontakt- und Fahrzeugdaten aus."}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, textTransform: "uppercase", letterSpacing: 1 }}>
                Kontaktdaten
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Vorname"  value={form.firstName} onChange={set("firstName")} fullWidth required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Nachname" value={form.lastName}  onChange={set("lastName")}  fullWidth required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="E-Mail"   type="email" value={form.email} onChange={set("email")} fullWidth required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Telefon"  value={form.phone}     onChange={set("phone")}     fullWidth required />
                </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, textTransform: "uppercase", letterSpacing: 1 }}>
                Fahrzeugdaten
            </Typography>

            {isLoggedIn && vehiclesLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                    <CircularProgress size={24} />
                </Box>
            ) : isLoggedIn && vehicles.length > 0 ? (
                <>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        Wählen Sie eines Ihrer gespeicherten Fahrzeuge oder geben Sie ein neues ein.
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        {vehicles.map((v) => (
                            <Grid key={v.id} size={{ xs: 12, sm: 6, md: 4 }}>
                                <Card
                                    variant="outlined"
                                    onClick={() => selectVehicle(v)}
                                    sx={{
                                        cursor: "pointer",
                                        borderColor: selectedVehicleId === v.id ? "primary.main" : "divider",
                                        bgcolor:     selectedVehicleId === v.id ? "rgba(198,40,40,0.07)" : "background.paper",
                                        transition:  "border-color 150ms, background-color 150ms",
                                        "&:hover": { borderColor: "primary.light" },
                                    }}
                                >
                                    <CardContent sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                                        <DirectionsCarFilledOutlinedIcon color={selectedVehicleId === v.id ? "primary" : "action"} sx={{ mt: 0.25 }} />
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={700}>
                                                {v.brand} {v.model}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {v.licensePlate ?? "Kein Kennzeichen"}{v.buildYear ? ` · Baujahr ${v.buildYear}` : ""}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card
                                variant="outlined"
                                onClick={selectNewVehicle}
                                sx={{
                                    cursor: "pointer",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minHeight: 72,
                                    borderColor: selectedVehicleId === NEW_VEHICLE ? "primary.main" : "divider",
                                    bgcolor:     selectedVehicleId === NEW_VEHICLE ? "rgba(198,40,40,0.07)" : "background.paper",
                                    borderStyle: "dashed",
                                    "&:hover": { borderColor: "primary.light" },
                                }}
                            >
                                <CardContent sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <AddCircleOutlineIcon color={selectedVehicleId === NEW_VEHICLE ? "primary" : "action"} />
                                    <Typography variant="subtitle2" fontWeight={700}>Neues Fahrzeug</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </>
            ) : null}

            {!isExistingVehicleSelected && (
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="Marke"       value={form.brand}        onChange={set("brand")}        fullWidth required />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="Modell"      value={form.model}        onChange={set("model")}        fullWidth required />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            label="Baujahr"
                            value={form.buildYear}
                            onChange={(e) => setForm((prev) => ({ ...prev, buildYear: e.target.value.replace(/[^0-9]/g, "").slice(0, 4) }))}
                            fullWidth
                            placeholder="z.B. 2019"
                            slotProps={{ htmlInput: { inputMode: "numeric", pattern: "[0-9]*", maxLength: 4 } }}
                            error={form.buildYear.trim() !== "" && !isValidBuildYear(form.buildYear)}
                            helperText={form.buildYear.trim() !== "" && !isValidBuildYear(form.buildYear) ? "Ungültiges Baujahr" : ""}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }}>
                        <TextField
                            label="Kennzeichen"
                            value={form.licensePlate}
                            onChange={(e) => setForm((prev) => ({ ...prev, licensePlate: sanitizePlateInput(e.target.value) }))}
                            fullWidth
                            required
                            placeholder="z.B. W-12345AB"
                            error={form.licensePlate.trim() !== "" && !isValidAustrianPlate(form.licensePlate)}
                            helperText={form.licensePlate.trim() !== "" && !isValidAustrianPlate(form.licensePlate) ? "Ungültiges österreichisches Kennzeichen (z.B. W-12345AB)" : ""}
                        />
                    </Grid>
                    {isLoggedIn && (
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="caption" color="text.secondary">
                                Dieses Fahrzeug wird nach der Anfrage automatisch in Ihrem Konto gespeichert.
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            )}

            <Divider sx={{ mb: 3 }} />

            <TextField
                label="Anmerkungen (optional)"
                value={form.note}
                onChange={set("note")}
                multiline
                rows={3}
                fullWidth
                placeholder="z. B. besondere Hinweise zu Ihrem Fahrzeug..."
            />
        </Box>
    );

    const StepConfirmation = (
        <Box>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                Zusammenfassung
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Bitte prüfen Sie Ihre Angaben vor dem Absenden.
            </Typography>
            <Stack spacing={2}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, textTransform: "uppercase", letterSpacing: 1 }}>
                            Termin
                        </Typography>
                        <Grid container spacing={1}>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="body2" color="text.secondary">Leistungen</Typography>
                                <Typography variant="body1" fontWeight={600}>{selectedServices.join(", ")}</Typography>
                            </Grid>
                            <Grid size={{ xs: 3 }}>
                                <Typography variant="body2" color="text.secondary">Datum</Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {form.date ? new Date(form.date).toLocaleDateString("de-AT") : "–"}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 3 }}>
                                <Typography variant="body2" color="text.secondary">Uhrzeit</Typography>
                                <Typography variant="body1" fontWeight={600}>{selectedTime} Uhr</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Card
                    variant="outlined"
                    sx={{
                        borderColor: "primary.main",
                        background: "linear-gradient(135deg, rgba(198,40,40,0.10), rgba(198,40,40,0.02))",
                    }}
                >
                    <CardContent>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, textTransform: "uppercase", letterSpacing: 1 }}>
                            Preis &amp; Dauer
                        </Typography>

                        {selectedOffer && (
                            <Chip
                                label={`Paket: ${selectedOffer.title}`}
                                color="primary"
                                size="small"
                                sx={{ mb: 1.5 }}
                            />
                        )}

                        <Stack spacing={1.25} sx={{ mb: selectedServiceObjects.length > 1 && !selectedOffer ? 2 : 1 }}>
                            {selectedOffer ? (
                                selectedOffer.services.map((s) => (
                                    <Typography key={s.id ?? s.title} variant="body2">
                                        • {s.title}
                                    </Typography>
                                ))
                            ) : (
                                selectedServiceObjects.map((s) => (
                                    <Stack key={s.id ?? s.title} direction="row" justifyContent="space-between" alignItems="baseline">
                                        <Typography variant="body2">{s.title}</Typography>
                                        <Stack direction="row" spacing={2}>
                                            <Typography variant="body2" color="text.secondary">
                                                {formatDuration(s.duration ?? 0)}
                                            </Typography>
                                            <Typography variant="body2" fontWeight={600} sx={{ minWidth: 72, textAlign: "right" }}>
                                                {formatPrice(s.price ?? 0)}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                ))
                            )}
                        </Stack>

                        {(selectedServiceObjects.length > 1 || selectedOffer) && <Divider sx={{ mb: 1.5 }} />}

                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Stack direction="row" spacing={1} alignItems="center">
                                <AccessTimeIcon fontSize="small" color="primary" />
                                <Typography variant="body1" fontWeight={700}>
                                    Geschätzte Gesamtdauer: {formatDuration(totalDuration)}
                                </Typography>
                            </Stack>
                            <Typography variant="h6" fontWeight={800} color="primary.main">
                                {formatPrice(totalPrice)}
                            </Typography>
                        </Stack>

                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                            Preis- und Zeitangaben sind Richtwerte. Je nach Fahrzeugzustand und Umfang der Arbeiten kann die tatsächliche
                            Dauer kürzer oder länger ausfallen; der finale Preis wird nach der Begutachtung bestätigt.
                        </Typography>
                    </CardContent>
                </Card>

                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, textTransform: "uppercase", letterSpacing: 1 }}>
                            Kontakt
                        </Typography>
                        <Grid container spacing={1}>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="body2" color="text.secondary">Name</Typography>
                                <Typography variant="body1" fontWeight={600}>{form.firstName} {form.lastName}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="body2" color="text.secondary">E-Mail</Typography>
                                <Typography variant="body1" fontWeight={600}>{form.email}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="body2" color="text.secondary">Telefon</Typography>
                                <Typography variant="body1" fontWeight={600}>{form.phone}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, textTransform: "uppercase", letterSpacing: 1 }}>
                            Fahrzeug
                        </Typography>
                        <Grid container spacing={1}>
                            <Grid size={{ xs: 4 }}>
                                <Typography variant="body2" color="text.secondary">Marke</Typography>
                                <Typography variant="body1" fontWeight={600}>{form.brand}</Typography>
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <Typography variant="body2" color="text.secondary">Modell</Typography>
                                <Typography variant="body1" fontWeight={600}>{form.model}</Typography>
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <Typography variant="body2" color="text.secondary">Baujahr</Typography>
                                <Typography variant="body1" fontWeight={600}>{form.buildYear || "–"}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="body2" color="text.secondary">Kennzeichen</Typography>
                                <Typography variant="body1" fontWeight={600}>{form.licensePlate}</Typography>
                            </Grid>
                        </Grid>
                        {form.note && (
                            <>
                                <Divider sx={{ my: 1.5 }} />
                                <Typography variant="body2" color="text.secondary">Anmerkungen</Typography>
                                <Typography variant="body2">{form.note}</Typography>
                            </>
                        )}
                    </CardContent>
                </Card>

                {errorMsg && (
                    <Alert severity="error" onClose={() => setErrorMsg(null)}>
                        {errorMsg}
                    </Alert>
                )}
            </Stack>
        </Box>
    );

    if (!isLoggedIn) {
        return (
            <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 }, textAlign: "center" }}>
                <LockOutlinedIcon sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                    Anmeldung erforderlich
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Um einen Termin anzufragen, melden Sie sich bitte mit Ihrem Konto an oder registrieren
                    Sie sich kostenlos. So können wir Ihre Anfrage eindeutig zuordnen und Sie über den Status
                    informieren.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                    <Button
                        variant="contained"
                        size="large"
                        component={RouterLink}
                        to="/login"
                        state={{ from: location.pathname }}
                    >
                        Anmelden
                    </Button>
                    <Button
                        variant="outlined"
                        size="large"
                        component={RouterLink}
                        to="/registrieren"
                        state={{ from: location.pathname }}
                    >
                        Registrieren
                    </Button>
                </Stack>
            </Container>
        );
    }

    if (submitted) {
        return (
            <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 }, textAlign: "center" }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 72, color: "primary.main", mb: 2 }} />
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                    Terminanfrage gesendet!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Wir haben Ihre Anfrage für <strong>{selectedServices.join(", ")}</strong> am{" "}
                    <strong>{form.date ? new Date(form.date).toLocaleDateString("de-AT") : ""}</strong> um{" "}
                    <strong>{selectedTime} Uhr</strong> erhalten.
                    <br />
                    Sie erhalten in Kürze eine Bestätigung per E-Mail.
                </Typography>
                <Button variant="contained" component={RouterLink} to="/">Zurück zur Startseite</Button>
            </Container>
        );
    }

    const STEP_CONTENT = [StepService, StepDateTime, StepCustomerData, StepConfirmation];

    return (
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
                    Termin anfragen
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Buchen Sie Ihren Werkstatt-Termin in wenigen Schritten online.
                </Typography>
                {isLoggedIn && (
                    <Chip
                        label={`Angemeldet als ${customer?.firstName} ${customer?.lastName}`}
                        color="primary"
                        size="small"
                        sx={{ mt: 1.5 }}
                    />
                )}
            </Box>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {STEPS.map((label) => (
                    <Step key={label}><StepLabel>{label}</StepLabel></Step>
                ))}
            </Stepper>

            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    {STEP_CONTENT[activeStep]}
                </CardContent>
            </Card>

            <Stack direction="row" justifyContent="space-between">
                <Button variant="outlined" color="inherit" onClick={handleBack} disabled={activeStep === 0 || loading}>
                    Zurück
                </Button>
                {activeStep < STEPS.length - 1 ? (
                    <Button variant="contained" onClick={handleNext} disabled={!canGoNext() || dataLoading}>
                        Weiter
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : undefined}
                    >
                        {loading ? "Wird gesendet…" : "Termin anfragen"}
                    </Button>
                )}
            </Stack>

            <Snackbar
                open={!!snackbar}
                autoHideDuration={4000}
                onClose={() => setSnackbar(null)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity="success" onClose={() => setSnackbar(null)} sx={{ width: "100%" }}>
                    {snackbar}
                </Alert>
            </Snackbar>
        </Container>
    );
}