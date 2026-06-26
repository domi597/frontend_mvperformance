/**
 * @description Multi-step appointment booking form for workshop customers.
 *              Services and timeslots are loaded from the backend API.
 * @author N
 * @since 14.04.2026
 */

import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Snackbar,
    Stack,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AuthService from "../service/AuthService";
import { createAppointment } from "../api/appointmentApi";
import { getServices, IService } from "../api/services";
import { getTimeslots, ITimeslot } from "../api/timeslotApi";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [svcs, slots] = await Promise.all([getServices(), getTimeslots()]);
                setServices(svcs);
                setTimeslots(slots);
            } catch {
                setDataError("Leistungen und Zeitslots konnten nicht geladen werden. Bitte Seite neu laden.");
            } finally {
                setDataLoading(false);
            }
        };
        fetchData();
    }, []);

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

    /**
     * Determines whether the user may advance to the next step.
     * Each step has its own required fields that must be filled.
     */
    const canGoNext = (): boolean => {
        if (activeStep === 0) return selectedServices.length > 0;
        if (activeStep === 1) return !!form.date && !!selectedTime;
        if (activeStep === 2)
            return !!(form.firstName && form.lastName && form.email &&
                form.phone && form.brand && form.model && form.licensePlate);
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
     * removed from the selection by clicking their card again.
     */
    const toggleService = (title: string) => {
        setSelectedServices((prev) =>
            prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
        );
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
                brand:        form.brand,
                model:        form.model,
                year:         form.buildYear ? parseInt(form.buildYear) : null,
                licensePlate: form.licensePlate,
                date:         form.date,
                time:         selectedTime,
                preferredDate,
                note:         form.note,
                price:        0,
                createdAt:    new Date().toISOString(),
            } as any);

            setSubmitted(true);
            setSnackbar("Ihr Termin wurde erfolgreich angefragt!");
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ??
                err?.response?.data ??
                "Fehler beim Senden der Terminanfrage. Bitte versuchen Sie es erneut.";
            setErrorMsg(typeof msg === "string" ? msg : JSON.stringify(msg));
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
                Wählen Sie einen freien Termin aus.
            </Typography>
            <Stack spacing={3}>
                <DatePicker
                    label="Datum"
                    value={form.date ? dayjs(form.date) : null}
                    onChange={(newValue) =>
                        setForm((prev) => ({
                            ...prev,
                            date: newValue ? newValue.format("YYYY-MM-DD") : "",
                        }))
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
                                            label={timeShort}
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
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Marke"       value={form.brand}        onChange={set("brand")}        fullWidth required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Modell"      value={form.model}        onChange={set("model")}        fullWidth required />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField label="Baujahr"     value={form.buildYear}    onChange={set("buildYear")}    fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 8 }}>
                    <TextField label="Kennzeichen" value={form.licensePlate} onChange={set("licensePlate")} fullWidth required />
                </Grid>
            </Grid>

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
                <Button variant="contained" href="/">Zurück zur Startseite</Button>
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
