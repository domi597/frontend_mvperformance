import { useEffect, useRef, useState } from "react";
import { Alert, Box, Button, CircularProgress, Link, Stack, TextField, Typography } from "@mui/material";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import RegisterService from "../service/RegisterService";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

/** Confirmation screen shown right after registration: enter the 6-digit code sent by e-mail. */
export default function VerifyEmailPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { email?: string; from?: string } | null;

    const email = state?.email ?? RegisterService.getPendingVerificationEmail() ?? "";
    const from  = state?.from;

    const [digits, setDigits]     = useState<string[]>(Array(CODE_LENGTH).fill(""));
    const [loading, setLoading]   = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError]       = useState<string | null>(null);
    const [info, setInfo]         = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(0);

    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        if (!email) {
            navigate("/registrieren");
        }
    }, [email, navigate]);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timeout = setTimeout(() => setCooldown((s) => s - 1), 1000);
        return () => clearTimeout(timeout);
    }, [cooldown]);

    const code = digits.join("");
    const isValid = code.length === CODE_LENGTH;

    /** Writes a single digit into the given box and jumps to the next one. */
    const handleDigitChange = (index: number, value: string) => {
        const clean = value.replace(/\D/g, "");
        if (!clean) {
            setDigits((prev) => prev.map((d, i) => (i === index ? "" : d)));
            return;
        }

        setDigits((prev) => {
            const next = [...prev];
            next[index] = clean[clean.length - 1];
            return next;
        });

        if (index < CODE_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    /** Jumps back on backspace when the current box is already empty. */
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === "Enter") {
            e.preventDefault();
            handleVerify();
        }
    };

    /** Allows pasting the full code at once into any box. */
    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
        if (!pasted) return;
        e.preventDefault();
        setDigits((prev) => {
            const next = [...prev];
            for (let i = 0; i < CODE_LENGTH; i++) next[i] = pasted[i] ?? next[i];
            return next;
        });
        inputRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
    };

    /** Submits the entered code and, on success, logs the user in and redirects home. */
    const handleVerify = async () => {
        if (!isValid || loading) return;
        setLoading(true);
        setError(null);
        setInfo(null);

        try {
            const kunde = await RegisterService.verifyEmail(email, code);
            RegisterService.setSuccessMessage(
                `Willkommen, ${kunde.firstName}! Deine E-Mail-Adresse wurde bestätigt.`
            );
            navigate(from ?? "/");
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { error?: string } } })
                ?.response?.data?.error;
            setError(message ?? "Der Code konnte nicht bestätigt werden. Bitte versuche es erneut.");
            setDigits(Array(CODE_LENGTH).fill(""));
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    /** Requests a fresh code and starts the resend cooldown. */
    const handleResend = async () => {
        if (resending || cooldown > 0) return;
        setResending(true);
        setError(null);
        setInfo(null);

        try {
            await RegisterService.resendVerification(email);
            setInfo("Wir haben dir einen neuen Code geschickt.");
            setCooldown(RESEND_COOLDOWN_SECONDS);
        } catch {
            setError("Der Code konnte nicht erneut verschickt werden. Bitte versuche es später.");
        } finally {
            setResending(false);
        }
    };

    return (
        <Stack spacing={3} alignItems="center" textAlign="center">
            <Box sx={{ color: "primary.main" }}>
                <MarkEmailReadOutlinedIcon sx={{ fontSize: 48 }} />
            </Box>

            <Box>
                <Typography variant="h6" fontWeight={700}>
                    E-Mail-Adresse bestätigen
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Wir haben einen 6-stelligen Code an{" "}
                    <Typography component="span" variant="body2" fontWeight={700}>
                        {email}
                    </Typography>{" "}
                    geschickt. Gib ihn unten ein, um dein Konto zu aktivieren.
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ width: "100%" }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            {info && (
                <Alert severity="success" sx={{ width: "100%" }} onClose={() => setInfo(null)}>
                    {info}
                </Alert>
            )}

            <Stack direction="row" spacing={1.2} justifyContent="center" onPaste={handlePaste}>
                {digits.map((d, i) => (
                    <TextField
                        key={i}
                        value={d}
                        onChange={(e) => handleDigitChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        inputRef={(el) => { inputRefs.current[i] = el; }}
                        autoFocus={i === 0}
                        size="small"
                        slotProps={{
                            htmlInput: {
                                inputMode: "numeric",
                                maxLength: 1,
                                style: { textAlign: "center", fontSize: 22, fontWeight: 700, padding: "10px 0" },
                            },
                        }}
                        sx={{ width: 48 }}
                    />
                ))}
            </Stack>

            <Button
                type="button"
                variant="contained"
                fullWidth
                size="large"
                disabled={!isValid || loading}
                onClick={handleVerify}
            >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Bestätigen"}
            </Button>

            <Typography variant="body2" color="text.secondary">
                Keinen Code erhalten?{" "}
                <Link
                    component="button"
                    type="button"
                    underline="hover"
                    onClick={handleResend}
                    sx={{
                        color: cooldown > 0 ? "text.disabled" : "primary.light",
                        fontWeight: 600,
                        cursor: cooldown > 0 ? "default" : "pointer",
                    }}
                    disabled={resending || cooldown > 0}
                >
                    {cooldown > 0 ? `Erneut senden (${cooldown}s)` : resending ? "Wird gesendet…" : "Code erneut senden"}
                </Link>
            </Typography>

            <Typography variant="caption" color="text.secondary">
                Falsche E-Mail-Adresse?{" "}
                <Link component={RouterLink} to="/registrieren" underline="hover" sx={{ fontWeight: 600 }}>
                    Zurück zur Registrierung
                </Link>
            </Typography>
        </Stack>
    );
}
