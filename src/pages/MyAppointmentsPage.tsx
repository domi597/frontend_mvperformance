import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    Snackbar,
    Stack,
    Typography,
} from "@mui/material";
import {
    CalendarMonthOutlined,
    DirectionsCarOutlined,
    EuroOutlined,
    EventBusyOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AuthService from "../service/AuthService";
import { cancelAppointment, getMyAppointments } from "../api/appointmentApi";
import type { IAppointment } from "../interface/IAppointment";
import type { AppointmentStatus } from "../types/AppointmentStatus";

/** Small uppercase section heading, matching the style used on the account overview page. */
function SectionLabel({ children }: { children: string }) {
    return (
        <Typography
            variant="overline"
            fontWeight={700}
            sx={{ color: "text.secondary", display: "block", mb: 2, letterSpacing: 1.5 }}
        >
            {children}
        </Typography>
    );
}

const STATUS_LABEL: Record<AppointmentStatus, string> = {
    NEU: "Neu",
    AUSSTEHEND: "Ausstehend",
    BESTÄTIGT: "Bestätigt",
    ABGELEHNT: "Abgelehnt",
    ABGESCHLOSSEN: "Abgeschlossen",
    STORNIERT: "Storniert",
};

const STATUS_COLOR: Record<AppointmentStatus, "info" | "warning" | "success" | "error" | "default"> = {
    NEU: "info",
    AUSSTEHEND: "warning",
    BESTÄTIGT: "success",
    ABGELEHNT: "error",
    ABGESCHLOSSEN: "default",
    STORNIERT: "default",
};

/** Termine in diesem Status kann der Kunde selbst stornieren. */
const CANCELLABLE: AppointmentStatus[] = ["NEU", "AUSSTEHEND", "BESTÄTIGT"];

/** Baut aus den getrennten date/time-Strings des Termins ein Date-Objekt. */
function toDate(appointment: IAppointment): Date {
    const time = appointment.time.length === 5 ? appointment.time : `0${appointment.time}`;
    return new Date(`${appointment.date}T${time}`);
}

function AppointmentCard({
                             appointment,
                             onCancelClick,
                         }: {
    appointment: IAppointment;
    onCancelClick: (appointment: IAppointment) => void;
}) {
    const dateLabel = new Date(`${appointment.date}T00:00:00`).toLocaleDateString("de-AT", {
        weekday: "short",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    return (
        <Paper
            elevation={0}
            sx={{ p: 2.5, mb: 2, borderRadius: 3, border: "1px solid", borderColor: "divider" }}
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
            >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }} flexWrap="wrap">
                        <Typography variant="subtitle1" fontWeight={700}>
                            {appointment.serviceType || "Termin"}
                        </Typography>
                        <Chip
                            label={STATUS_LABEL[appointment.status]}
                            size="small"
                            color={STATUS_COLOR[appointment.status]}
                            sx={{ fontSize: 11, height: 20 }}
                        />
                    </Stack>
                    <Stack direction="row" spacing={2.5} flexWrap="wrap" rowGap={0.5} sx={{ color: "text.secondary" }}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <CalendarMonthOutlined sx={{ fontSize: 16 }} />
                            <Typography variant="body2">{dateLabel} · {appointment.time} Uhr</Typography>
                        </Stack>
                        {(appointment.brand || appointment.model) && (
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <DirectionsCarOutlined sx={{ fontSize: 16 }} />
                                <Typography variant="body2">{appointment.brand} {appointment.model}</Typography>
                            </Stack>
                        )}
                        {appointment.price != null && (
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <EuroOutlined sx={{ fontSize: 16 }} />
                                <Typography variant="body2">{appointment.price.toFixed(2)} €</Typography>
                            </Stack>
                        )}
                    </Stack>
                </Box>

                {CANCELLABLE.includes(appointment.status) && (
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => onCancelClick(appointment)}
                        sx={{ borderRadius: 2, flexShrink: 0 }}
                    >
                        Stornieren
                    </Button>
                )}
            </Stack>
        </Paper>
    );
}

export default function MyAppointmentsPage() {
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState<IAppointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const [cancelTarget, setCancelTarget] = useState<IAppointment | null>(null);
    const [cancelSaving, setCancelSaving] = useState(false);
    const [cancelError, setCancelError] = useState<string | null>(null);

    useEffect(() => {
        if (!AuthService.isLoggedIn()) {
            navigate("/login");
            return;
        }
        setLoading(true);
        getMyAppointments()
            .then(setAppointments)
            .catch(() => setError("Termine konnten nicht geladen werden."))
            .finally(() => setLoading(false));
    }, [navigate]);

    // Anstehende Termine: noch nicht stattgefunden und weder storniert noch abgeschlossen.
    // Vergangene Termine: alles andere (inkl. bereits abgeschlossener/stornierter Termine).
    const { upcoming, past } = useMemo(() => {
        const now = new Date();
        const upcomingList = appointments
            .filter((a) => a.status !== "ABGESCHLOSSEN" && a.status !== "STORNIERT" && toDate(a) >= now)
            .sort((a, b) => toDate(a).getTime() - toDate(b).getTime());
        const upcomingIds = new Set(upcomingList.map((a) => a.id));
        const pastList = appointments
            .filter((a) => !upcomingIds.has(a.id))
            .sort((a, b) => toDate(b).getTime() - toDate(a).getTime());
        return { upcoming: upcomingList, past: pastList };
    }, [appointments]);

    const confirmCancel = async () => {
        if (!cancelTarget) return;
        setCancelSaving(true);
        setCancelError(null);
        try {
            const updated = await cancelAppointment(cancelTarget.id);
            setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
            setSuccessMsg("Termin wurde storniert.");
            setCancelTarget(null);
        } catch (err) {
            const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
            setCancelError(message ?? "Termin konnte nicht storniert werden.");
        } finally {
            setCancelSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                Meine Termine
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <SectionLabel>Anstehende Termine</SectionLabel>
            {upcoming.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{ p: 4, mb: 4, borderRadius: 3, border: "1px dashed", borderColor: "divider", textAlign: "center" }}
                >
                    <EventBusyOutlined sx={{ fontSize: 32, color: "text.disabled", mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                        Du hast aktuell keine anstehenden Termine.
                    </Typography>
                </Paper>
            ) : (
                <Box sx={{ mb: 4 }}>
                    {upcoming.map((a) => (
                        <AppointmentCard key={a.id} appointment={a} onCancelClick={setCancelTarget} />
                    ))}
                </Box>
            )}

            <SectionLabel>Vergangene Termine</SectionLabel>
            {past.length === 0 ? (
                <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px dashed", borderColor: "divider", textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                        Noch keine vergangenen Termine vorhanden.
                    </Typography>
                </Paper>
            ) : (
                <Box>
                    {past.map((a) => (
                        <AppointmentCard key={a.id} appointment={a} onCancelClick={setCancelTarget} />
                    ))}
                </Box>
            )}

            <Dialog
                open={!!cancelTarget}
                onClose={() => { if (!cancelSaving) setCancelTarget(null); }}
                maxWidth="xs"
                fullWidth
                slotProps={{ paper: { sx: { borderRadius: 3 } } }}
            >
                <DialogTitle fontWeight={700}>Termin stornieren</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Soll der Termin am <strong>{cancelTarget?.date}</strong> um <strong>{cancelTarget?.time}</strong> Uhr
                        wirklich storniert werden? Diese Aktion kann nicht rückgängig gemacht werden.
                    </DialogContentText>
                    {cancelError && (
                        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setCancelError(null)}>
                            {cancelError}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={() => setCancelTarget(null)} disabled={cancelSaving}>Zurück</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={confirmCancel}
                        disabled={cancelSaving}
                        sx={{ borderRadius: 2 }}
                    >
                        {cancelSaving ? <CircularProgress size={16} color="inherit" /> : "Termin stornieren"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={!!successMsg}
                autoHideDuration={4000}
                onClose={() => setSuccessMsg(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity="success" onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>
            </Snackbar>
        </Container>
    );
}
