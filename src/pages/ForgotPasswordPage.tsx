import { useState } from "react";
import { Alert, Box, Button, CircularProgress, Link, Stack, TextField, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { forgotPasswordApi } from "../api/auth";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);

    const emailError = email.length > 0 && !email.includes("@");
    const formValid = email.length > 0 && !emailError;

    /**
     * Fordert einen Reset-Link an. Antwortet dem Nutzer bewusst immer mit derselben
     * Erfolgsmeldung, egal ob die E-Mail existiert (Server verhält sich genauso).
     */
    const handleSubmit = async () => {
        if (!formValid) return;
        setLoading(true);
        setError(null);

        try {
            await forgotPasswordApi({ email });
            setSent(true);
        } catch {
            setError("Server nicht erreichbar. Bitte später versuchen.");
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

    if (sent) {
        return (
            <Stack spacing={2.5}>
                <Alert severity="success">
                    Falls ein Konto mit dieser E-Mail existiert, wurde ein Link zum Zurücksetzen des Passworts versendet.
                </Alert>
                <Box sx={{ textAlign: "center" }}>
                    <Link component={RouterLink} to="/login" underline="hover" sx={{ color: "primary.light", fontWeight: 600 }}>
                        Zurück zum Login
                    </Link>
                </Box>
            </Stack>
        );
    }

    return (
        <Stack spacing={2.5} onKeyDown={handleKeyDown}>

            <Typography variant="body2" color="text.secondary">
                Gib deine E-Mail-Adresse ein. Wir senden dir einen Link, um dein Passwort zurückzusetzen.
            </Typography>

            {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
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

            <Button
                type="button"
                variant="contained"
                fullWidth
                disabled={!formValid || loading}
                onClick={handleSubmit}
                size="large"
                sx={{ mt: 0.5 }}
            >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Link senden"}
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
