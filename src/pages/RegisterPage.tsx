import { useState } from "react";
import {
    Alert, Box, Button, Checkbox, CircularProgress, FormControlLabel, FormHelperText,
    IconButton, InputAdornment, Link, Stack, TextField, Typography,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import RegisterService from "../service/RegisterService";
import type { RegisterRequest } from "../types/RegisterTypes";
import { isValidAustrianPlate, isValidBuildYear, sanitizePlateInput } from "../utils/validation";

const required = (val: string) => val.trim().length > 0;

/** Kleine Überschrift für einen Formularabschnitt, mit Icon. */
function SectionHeading({ icon, title, hint }: { icon: React.ReactNode; title: string; hint?: string }) {
    return (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <Box sx={{ color: "primary.main", display: "flex" }}>{icon}</Box>
            <Typography variant="subtitle2" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: 0.6 }}>
                {title}
            </Typography>
            {hint && (
                <Typography variant="caption" color="text.secondary">
                    {hint}
                </Typography>
            )}
        </Stack>
    );
}

/** Umrandeter Container, der einen Formularabschnitt optisch vom Rest abhebt. */
function SectionCard({ children }: { children: React.ReactNode }) {
    return (
        <Box
            sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                p: { xs: 2, sm: 2.5 },
            }}
        >
            {children}
        </Box>
    );
}

/** Registration form — validates on first submit, then sends the user to the e-mail verification step. */
export default function RegisterPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: string } | null)?.from;

    const [form, setForm] = useState<RegisterRequest>({
        vorname:    "",
        nachname:   "",
        email:      "",
        password:   "",
        telefon:    "",
        strasse:    "",
        plz:        "",
        ort:        "",
        marke:      "",
        modell:     "",
        baujahr:    null,
        kennzeichen:"",
    });

    const [submitted, setSubmitted]       = useState(false);
    const [loading, setLoading]           = useState(false);
    const [error, setError]               = useState<string | null>(null);
    const [agbAccepted, setAgbAccepted]   = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const errors = {
        vorname:      submitted && !required(form.vorname),
        nachname:     submitted && !required(form.nachname),
        email:        submitted && (!required(form.email) || !form.email.includes("@")),
        password:     submitted && form.password.length < 6,
        telefon:      submitted && !required(form.telefon),
        strasse:      submitted && !required(form.strasse),
        plz:          submitted && !required(form.plz),
        ort:          submitted && !required(form.ort),
        kennzeichen:  submitted && !isValidAustrianPlate(form.kennzeichen),
        baujahr:      submitted && !isValidBuildYear(form.baujahr != null ? String(form.baujahr) : ""),
    };

    const isValid =
        required(form.vorname) &&
        required(form.nachname) &&
        form.email.includes("@") &&
        form.password.length >= 6 &&
        required(form.telefon) &&
        required(form.strasse) &&
        required(form.plz) &&
        required(form.ort) &&
        isValidAustrianPlate(form.kennzeichen) &&
        isValidBuildYear(form.baujahr != null ? String(form.baujahr) : "") &&
        agbAccepted;

    /** Returns an onChange handler for the given form field. Sanitizes `baujahr` and `kennzeichen`. */
    const set = (field: keyof RegisterRequest) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (field === "baujahr") {
                const digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
                setForm((prev) => ({ ...prev, baujahr: digits ? Number(digits) : null }));
                return;
            }
            if (field === "kennzeichen") {
                setForm((prev) => ({ ...prev, kennzeichen: sanitizePlateInput(e.target.value) }));
                return;
            }
            const val = e.target.value;
            setForm((prev) => ({ ...prev, [field]: val }));
        };

    /** Validates and submits the form, then sends the user to the e-mail confirmation step. */
    const handleRegister = async () => {
        setSubmitted(true);
        if (!isValid) return;

        setLoading(true);
        setError(null);

        try {
            await RegisterService.register(form);
            navigate("/email-bestaetigen", { state: { email: form.email, from } });
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { error?: string } } })
                ?.response?.data?.error;
            setError(message ?? "Registrierung fehlgeschlagen. Bitte versuche es später erneut.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack spacing={3.5}>

            {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Persönliche Daten */}
            <Box>
                <SectionHeading icon={<PersonOutlineIcon fontSize="small" />} title="Persönliche Daten" />
                <SectionCard>
                    <Stack spacing={2}>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField
                                label="Vorname"
                                value={form.vorname}
                                onChange={set("vorname")}
                                error={errors.vorname}
                                helperText={errors.vorname ? "Pflichtfeld" : ""}
                                size="small"
                                fullWidth
                                autoFocus
                            />
                            <TextField
                                label="Nachname"
                                value={form.nachname}
                                onChange={set("nachname")}
                                error={errors.nachname}
                                helperText={errors.nachname ? "Pflichtfeld" : ""}
                                size="small"
                                fullWidth
                            />
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField
                                label="E-Mail"
                                type="email"
                                value={form.email}
                                onChange={set("email")}
                                error={errors.email}
                                helperText={errors.email ? "Gültige E-Mail eingeben" : ""}
                                size="small"
                                fullWidth
                                autoComplete="email"
                            />
                            <TextField
                                label="Telefon"
                                value={form.telefon}
                                onChange={set("telefon")}
                                error={errors.telefon}
                                helperText={errors.telefon ? "Pflichtfeld" : ""}
                                size="small"
                                fullWidth
                                placeholder="+43 664 123 4567"
                            />
                        </Stack>

                        <TextField
                            label="Passwort"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={set("password")}
                            error={errors.password}
                            helperText={errors.password ? "Mindestens 6 Zeichen" : ""}
                            size="small"
                            fullWidth
                            autoComplete="new-password"
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
                    </Stack>
                </SectionCard>
            </Box>

            {/* Adresse */}
            <Box>
                <SectionHeading icon={<HomeOutlinedIcon fontSize="small" />} title="Adresse" />
                <SectionCard>
                    <Stack spacing={2}>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField
                                label="Straße"
                                value={form.strasse}
                                onChange={set("strasse")}
                                error={errors.strasse}
                                helperText={errors.strasse ? "Pflichtfeld" : ""}
                                size="small"
                                fullWidth
                            />
                            <TextField
                                label="PLZ"
                                value={form.plz}
                                onChange={set("plz")}
                                error={errors.plz}
                                helperText={errors.plz ? "Pflichtfeld" : ""}
                                size="small"
                                sx={{ width: { xs: "100%", sm: 140 }, flexShrink: 0 }}
                            />
                        </Stack>

                        <TextField
                            label="Ort"
                            value={form.ort}
                            onChange={set("ort")}
                            error={errors.ort}
                            helperText={errors.ort ? "Pflichtfeld" : ""}
                            size="small"
                            fullWidth
                        />
                    </Stack>
                </SectionCard>
            </Box>

            {/* Fahrzeugdaten */}
            <Box>
                <SectionHeading
                    icon={<DirectionsCarFilledOutlinedIcon fontSize="small" />}
                    title="Fahrzeugdaten"
                    hint="(optional)"
                />
                <SectionCard>
                    <Stack spacing={2}>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField
                                label="Marke"
                                value={form.marke}
                                onChange={set("marke")}
                                size="small"
                                fullWidth
                                placeholder="z.B. VW"
                            />
                            <TextField
                                label="Modell"
                                value={form.modell}
                                onChange={set("modell")}
                                size="small"
                                fullWidth
                                placeholder="z.B. Golf"
                            />
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField
                                label="Baujahr"
                                value={form.baujahr ?? ""}
                                onChange={set("baujahr")}
                                size="small"
                                fullWidth
                                placeholder="z.B. 2019"
                                slotProps={{ htmlInput: { inputMode: "numeric", pattern: "[0-9]*", maxLength: 4 } }}
                                error={errors.baujahr}
                                helperText={errors.baujahr ? "Ungültiges Baujahr" : ""}
                            />
                            <TextField
                                label="Kennzeichen"
                                value={form.kennzeichen}
                                onChange={set("kennzeichen")}
                                size="small"
                                fullWidth
                                placeholder="z.B. LB-ABC123"
                                error={errors.kennzeichen}
                                helperText={errors.kennzeichen ? "Ungültiges österreichisches Kennzeichen (z.B. LB-ABC123)" : ""}
                            />
                        </Stack>
                    </Stack>
                </SectionCard>
            </Box>

            <Box>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={agbAccepted}
                            onChange={(e) => setAgbAccepted(e.target.checked)}
                            size="small"
                            color={submitted && !agbAccepted ? "error" : "primary"}
                        />
                    }
                    label={
                        <Typography variant="body2" color={submitted && !agbAccepted ? "error" : "text.secondary"}>
                            Ich akzeptiere die {" "}
                            <Link href="/agbs" underline="hover" sx={{ color: "primary.light", fontWeight: 600 }}>
                                AGBs
                            </Link>{" "}
                            und{" "}
                            <Link href="/datenschutz" underline="hover" sx={{ color: "primary.light", fontWeight: 600 }}>
                                Datenschutzerklärung
                            </Link>
                        </Typography>
                    }
                />
                {submitted && !agbAccepted && (
                    <FormHelperText error sx={{ ml: 4 }}>
                        Ich habe die AGB und die Datenschutzerklärung gelesen und akzeptiert
                    </FormHelperText>
                )}
            </Box>

            <Button
                type="button"
                variant="contained"
                fullWidth
                size="large"
                onClick={handleRegister}
                disabled={loading}
            >
                {loading
                    ? <CircularProgress size={20} color="inherit" />
                    : "Konto erstellen"
                }
            </Button>

            <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                    Bereits ein Konto?{" "}
                    <Link
                        component={RouterLink}
                        to="/login"
                        underline="hover"
                        sx={{ color: "primary.light", fontWeight: 600 }}
                    >
                        Jetzt anmelden
                    </Link>
                </Typography>
            </Box>

        </Stack>
    );
}