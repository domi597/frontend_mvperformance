/**
 * @file RegisterPage.tsx
 * @description Registration page for new customers.
 *
 * The form is split into two sections:
 * - **Personal data** (required): first name, last name, email, password, phone, address
 * - **Vehicle data** (optional): brand, model, year of manufacture, licence plate
 *
 * Validation runs on every field after the first submit attempt.
 * On success the user is redirected to the home page and a welcome
 * message is stored via {@link RegisterService.setSuccessMessage}.
 *
 * @author N
 * @since 07.04.2026
 */

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormHelperText,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import RegisterService from "../service/RegisterService";
import type { RegisterRequest } from "../types/RegisterTypes";

/**
 * Returns `true` when the trimmed string contains at least one character.
 * Used to check whether a required text field has been filled in.
 *
 * @param val - The field value to check.
 */
const required = (val: string) => val.trim().length > 0;

/**
 * `RegisterPage` renders the customer registration form.
 *
 * ## State
 * | Variable    | Purpose                                              |
 * |-------------|------------------------------------------------------|
 * | `form`      | Controlled form values mapped to {@link RegisterRequest} |
 * | `submitted` | Whether the user has attempted to submit at least once |
 * | `loading`   | Shows a spinner while the API request is in flight   |
 * | `error`     | Holds an error message string when registration fails |
 *
 * ## Validation rules (required fields only)
 * - `vorname`, `nachname`, `telefon`, `strasse`, `plz`, `ort` — must not be blank
 * - `email` — must contain `@`
 * - `password` — minimum 6 characters
 *
 * @returns The registration form wrapped in a MUI `Stack`.
 */
export default function RegisterPage() {
  const navigate = useNavigate();

  /** Controlled state for every form field. */
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

  /** `true` after the first submit attempt — enables per-field error display. */
  const [submitted, setSubmitted]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  /** Whether the user has accepted the Terms of Service and Privacy Policy. */
  const [agbAccepted, setAgbAccepted] = useState(false);

  /**
   * Per-field error flags.
   * Errors are only shown after the first submit attempt (`submitted === true`)
   * so the form does not look broken when the user first opens the page.
   */
  const errors = {
    vorname:  submitted && !required(form.vorname),
    nachname: submitted && !required(form.nachname),
    email:    submitted && (!required(form.email) || !form.email.includes("@")),
    password: submitted && form.password.length < 6,
    telefon:  submitted && !required(form.telefon),
    strasse:  submitted && !required(form.strasse),
    plz:      submitted && !required(form.plz),
    ort:      submitted && !required(form.ort),
  };

  /** `true` when all required fields pass their validation rules and AGB is accepted. */
  const isValid =
    required(form.vorname) &&
    required(form.nachname) &&
    form.email.includes("@") &&
    form.password.length >= 6 &&
    required(form.telefon) &&
    required(form.strasse) &&
    required(form.plz) &&
    required(form.ort) &&
    agbAccepted;

  /**
   * Returns a generic `onChange` handler for a given form field.
   * The `baujahr` field is coerced to `number | null`; all others stay as strings.
   *
   * @param field - The key of the {@link RegisterRequest} field to update.
   */
  const set = (field: keyof RegisterRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = field === "baujahr"
        ? (e.target.value ? Number(e.target.value) : null)
        : e.target.value;
      setForm((prev) => ({ ...prev, [field]: val }));
    };

  /**
   * Handles form submission.
   *
   * 1. Marks the form as submitted to reveal validation errors.
   * 2. Aborts early if any required field is invalid.
   * 3. Calls {@link RegisterService.register} with the current form values.
   * 4. On success: stores a welcome message via {@link RegisterService.setSuccessMessage}
   *    and navigates the user to the home page (`/`).
   * 5. On failure: displays a generic error alert.
   */
  const handleRegister = async () => {
    setSubmitted(true);
    if (!isValid) return;

    setLoading(true);
    setError(null);

    try {
      await RegisterService.register(form);

      // Store a success message that the HomePage will pick up and display.
      RegisterService.setSuccessMessage(
        `Willkommen, ${form.vorname}! Ihr Konto wurde erfolgreich erstellt.`
      );

      navigate("/");
    } catch {
      setError("Registrierung fehlgeschlagen. Bitte versuche es später erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2.5}>

      {/* Fehlermeldung */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* ── Persönliche Daten ── */}
      <Typography variant="caption" color="text.secondary" fontWeight={600}
        sx={{ textTransform: "uppercase", letterSpacing: 0.8 }}>
        Persönliche Daten
      </Typography>

      <Stack direction="row" spacing={1.5}>
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
        label="Passwort"
        type="password"
        value={form.password}
        onChange={set("password")}
        error={errors.password}
        helperText={errors.password ? "Mindestens 6 Zeichen" : ""}
        size="small"
        fullWidth
        autoComplete="new-password"
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

      <Stack direction="row" spacing={1.5}>
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
          sx={{ width: 110, flexShrink: 0 }}
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

      {/* ── Fahrzeugdaten (optional) ── */}
      <Divider />

      <Box>
        <Typography variant="caption" color="text.secondary" fontWeight={600}
          sx={{ textTransform: "uppercase", letterSpacing: 0.8 }}>
          Fahrzeugdaten
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
          (optional)
        </Typography>
      </Box>

      <Stack direction="row" spacing={1.5}>
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

      <Stack direction="row" spacing={1.5}>
        <TextField
          label="Baujahr"
          type="number"
          value={form.baujahr ?? ""}
          onChange={set("baujahr")}
          size="small"
          fullWidth
          placeholder="z.B. 2019"
          slotProps={{ htmlInput: { min: 1950, max: new Date().getFullYear() } }}
        />
        <TextField
          label="Kennzeichen"
          value={form.kennzeichen}
          onChange={set("kennzeichen")}
          size="small"
          fullWidth
          placeholder="z.B. GZ-12345"
        />
      </Stack>

      {/* ── AGB & Datenschutz ── */}
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

      {/* ── Registrieren Button ── */}
      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={handleRegister}
        disabled={loading}
        sx={{ mt: 0.5 }}
      >
        {loading
          ? <CircularProgress size={20} color="inherit" />
          : "Konto erstellen"
        }
      </Button>

      {/* ── Link zur Login-Seite ── */}
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
