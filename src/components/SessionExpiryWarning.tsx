import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { AccessTimeOutlined } from "@mui/icons-material";
import AuthService from "../service/AuthService";

const WARNING_BEFORE_MS = 2 * 60 * 1000;
const CHECK_INTERVAL_MS = 1000;

function formatRemaining(ms: number): string {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function SessionExpiryWarning() {
    const navigate = useNavigate();
    const [remainingMs, setRemainingMs] = useState<number | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [refreshError, setRefreshError] = useState<string | null>(null);
    const loggedOutRef = useRef(false);

    const handleLogout = () => {
        loggedOutRef.current = true;
        AuthService.logout();
        setRemainingMs(null);
        navigate("/login");
    };

    const handleStaySignedIn = async () => {
        setRefreshing(true);
        setRefreshError(null);
        try {
            await AuthService.refresh();
            setRemainingMs(null);
        } catch {
            setRefreshError("Sitzung konnte nicht verlängert werden. Bitte melde dich neu an.");
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        const tick = () => {
            if (!AuthService.isLoggedIn()) {
                setRemainingMs(null);
                return;
            }

            const expiryMs = AuthService.getTokenExpiryMs();
            if (expiryMs === null) {
                setRemainingMs(null);
                return;
            }

            const diff = expiryMs - Date.now();

            if (diff <= 0) {
                // Token ist abgelaufen: sauber ausloggen, statt den Nutzer einfach
                // beim nächsten Request mit einem 401 "rauszuwerfen".
                if (!loggedOutRef.current) {
                    handleLogout();
                }
                return;
            }

            setRemainingMs(diff <= WARNING_BEFORE_MS ? diff : null);
        };

        loggedOutRef.current = false;
        tick();
        const interval = setInterval(tick, CHECK_INTERVAL_MS);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isOpen = remainingMs !== null;

    return (
        <Dialog open={isOpen} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
            <DialogTitle fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccessTimeOutlined color="warning" />
                Sitzung läuft bald ab
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Du hast dich schon länger nicht neu angemeldet. Deine Sitzung läuft in{" "}
                    <strong>{remainingMs !== null ? formatRemaining(remainingMs) : "0:00"}</strong>{" "}
                    Minuten ab. Möchtest du wirklich angemeldet bleiben?
                </DialogContentText>
                {refreshError && (
                    <Alert severity="error" sx={{ mt: 2 }} onClose={() => setRefreshError(null)}>
                        {refreshError}
                    </Alert>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleLogout} disabled={refreshing} color="inherit">
                    Abmelden
                </Button>
                <Button onClick={handleStaySignedIn} disabled={refreshing} variant="contained">
                    {refreshing ? "Bitte warten…" : "Angemeldet bleiben"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
