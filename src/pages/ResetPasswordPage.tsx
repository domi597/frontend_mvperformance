import { useState } from "react";
import {Alert, Box, Button, CircularProgress, IconButton, InputAdornment, Link, Stack, TextField, Typography,} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordApi } from "../api/auth";

/**
 * Zielseite des Links aus der "Passwort vergessen"-E-Mail.
 * Der Reset-Token kommt als Query-Parameter (?token=...) mit.
 */
export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const passwordError = newPassword.length > 0 && newPassword.length < 6;
    const confirmError = newPasswordConfirm.length > 0 && newPasswordConfirm !== newPassword;
    const formValid = !!token && newPassword.length >= 6 && newPasswordConfirm.length > 0 && !confirmError;

    /**
     * Sendet Token + neues Passwort ans Backend. Serverseitige Fehler (z. B. abgelaufener
     * Link oder nicht übereinstimmende Passwörter) werden 1:1 als Fehlermeldung angezeigt.
     */
    const handleSubmit = async () => {
        if (!formValid) return;
        setLoading(true);
        setError(null);

        try {
            await resetPasswordApi({ token, newPassword, newPasswordConfirm });
            setSuccess(true);
            setTimeout(() => navigate("/login"), 2500);
        } catch (err: unknown) {
            const status = (err as { response?: { status?: number } })?.response?.status;
            const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
            if (status === 400 && message) {
                setError(message);
            } else {
                setError("Server nicht erreichbar. Bitte später versuchen.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
    };

    if (!token) {
        return (
            <Stack spacing={2.5}>
                <Alert severity="error">
                    Dieser Link ist ungültig. Bitte fordere einen neuen Link zum Zurücksetzen des Passworts an.
                </Alert>
                <Box sx={{ textAlign: "center" }}>
                    <Link component={RouterLink} to="/passwort-vergessen" underline="hover" sx={{ color: "primary.light", fontWeight: 600 }}>
                        Neuen Link anfordern
                    </Link>
                </Box>
            </Stack>
        );
    }

    if (success) {
        return (
            <Alert severity="success">
                Dein Passwort wurde erfolgreich geändert. Du wirst gleich zum Login weitergeleitet.
            </Alert>
        );
    }

    return (
        <Stack spacing={2.5} onKeyDown={handleKeyDown}>

            <Typography variant="body2" color="text.secondary">
                Bitte gib dein neues Passwort ein.
            </Typography>

            {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <TextField
                label="Neues Passwort"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={passwordError}
                helperText={passwordError ? "Passwort muss mindestens 6 Zeichen haben" : ""}
                autoComplete="new-password"
                autoFocus
                fullWidth
                size="small"
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword((v) => !v)}
                                    edge="end"
                                    size="small"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />

            <TextField
                label="Neues Passwort bestätigen"
                type={showPassword ? "text" : "password"}
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                error={confirmError}
                helperText={confirmError ? "Passwörter stimmen nicht überein" : ""}
                autoComplete="new-password"
                fullWidth
                size="small"
            />

            <Button
                type="button"
                variant="contained"
                fullWidth
                disabled={!formValid || loading}
                onClick={handleSubmit}
                size="large"
                sx={{ mt: 0.5 }}
            >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Passwort ändern"}
            </Button>

            <Box sx={{ textAlign: "center" }}>
                <Link
                    component={RouterLink}
                    to="/login"
                    variant="caption"
                    underline="hover"
                    sx={{ color: "text.secondary" }}
                >
                    Zurück zum Login
                </Link>
            </Box>

        </Stack>
    );
}
