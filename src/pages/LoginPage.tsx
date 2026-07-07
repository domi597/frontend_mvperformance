import { useEffect, useState } from "react";
import {Alert, Box, Button, CircularProgress, Divider, IconButton, InputAdornment, Link, Stack, TextField, Typography,} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import AuthService from "../service/AuthService";
export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: string } | null)?.from;

    const [email, setEmail]               = useState("");
    const [password, setPassword]         = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading]           = useState(false);
    const [error, setError]               = useState<string | null>(null);
    const [retryAfter, setRetryAfter]     = useState<number | null>(null);

    const emailError    = email.length > 0 && !email.includes("@");
    const passwordError = password.length > 0 && password.length < 6;
    const formValid     = email.length > 0 && password.length >= 6 && !emailError;

    useEffect(() => {
        if (retryAfter === null || retryAfter <= 0) return;
        const timeout = setTimeout(() => setRetryAfter((s) => (s !== null ? s - 1 : null)), 1000);
        return () => clearTimeout(timeout);
    }, [retryAfter]);

    /**
     * Submits the login credentials to the server and redirects on success.
     * HTTP error codes are mapped to user-friendly messages
     * (`401` wrong password, `404` email not found, otherwise server error).
     */
    const handleLogin = async () => {
        if (!formValid) return;
        setLoading(true);
        setError(null);

        try {
            const result = await AuthService.login({ email, password });

            if (result.kunde.role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate(from ?? "/");
            }
        } catch (err: unknown) {
            const response = (err as { response?: { status?: number; headers?: Record<string, string> } })?.response;
            const status = response?.status;

            if (status === 429) {
                const retryAfterHeader = response?.headers?.["retry-after"];
                const seconds = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60;
                setRetryAfter(Number.isNaN(seconds) ? 60 : seconds);
                setError(null);
            } else if (status === 401) {
                setError("E-Mail oder Passwort ist falsch.");
            } else if (status === 404) {
                setError("Kein Konto mit dieser E-Mail gefunden.");
            } else if (status === 403) {
                navigate("/email-bestaetigen", { state: { email, from } });
            } else {
                setError("Server nicht erreichbar. Bitte später versuchen.");
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Allows the form to be submitted by pressing Enter.
     * @param e - Keyboard event from the surrounding `Stack`.
     */
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleLogin();
        }
    };

    return (
        <Stack spacing={2.5} onKeyDown={handleKeyDown}>

            {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {retryAfter !== null && retryAfter > 0 && (
                <Alert severity="warning">
                    Zu viele Fehlversuche. Bitte warte noch <strong>{retryAfter}</strong>{" "}
                    {retryAfter === 1 ? "Sekunde" : "Sekunden"}, bevor du es erneut versuchst.
                </Alert>
            )}

            <TextField
                label="E-Mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                helperText={emailError ? "Bitte eine gültige E-Mail eingeben" : ""}
                autoComplete="email"
                autoFocus
                fullWidth
                size="small"
            />

            <TextField
                label="Passwort"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                helperText={passwordError ? "Passwort muss mindestens 6 Zeichen haben" : ""}
                autoComplete="current-password"
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

            <Box sx={{ textAlign: "right", mt: -1.5 }}>
                <Link
                    component={RouterLink}
                    to="/passwort-vergessen"
                    variant="caption"
                    underline="hover"
                    sx={{ color: "text.secondary" }}
                >
                    Passwort vergessen?
                </Link>
            </Box>

            <Button
                type="button"
                variant="contained"
                fullWidth
                disabled={!formValid || loading || (retryAfter !== null && retryAfter > 0)}
                onClick={handleLogin}
                size="large"
                sx={{ mt: 0.5 }}
            >
                {loading ? (
                    <CircularProgress size={20} color="inherit" />
                ) : (
                    "Anmelden"
                )}
            </Button>

            <Divider>
                <Typography variant="caption" color="text.secondary">
                    oder
                </Typography>
            </Divider>

            <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                    Noch kein Konto?{" "}
                    <Link
                        component={RouterLink}
                        to="/registrieren"
                        underline="hover"
                        sx={{ color: "primary.light", fontWeight: 600 }}
                    >
                        Jetzt registrieren
                    </Link>
                </Typography>
            </Box>

        </Stack>
    );
}
