// RegisterPage.tsx
// Registrierungsseite für neue Kunden.
// Felder: persönliche Daten + Fahrzeugdaten (optional).
// Nach erfolgreicher Registrierung → Weiterleitung zur Startseite
// mit einer Erfolgsmeldung (via RegisterService + localStorage). -N 07.04.2026

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import RegisterService from "../service/RegisterService";
import type { RegisterRequest } from "../types/RegisterTypes";

// Hilfsfunktion: Ist das Feld ausgefüllt?
const required = (val: string) => val.trim().length > 0;

export default function RegisterPage() {
  const navigate = useNavigate();

  // Formular-State
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

  // UI-State
  const [submitted, setSubmitted] = useState(false); // wurde schon versucht abzusenden?
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  // Feldfehler (nur nach erstem Submit sichtbar)
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

  // Formular ist gültig wenn kein Pflichtfeld fehlt
  const isValid =
    required(form.vorname) &&
    required(form.nachname) &&
    form.email.includes("@") &&
    form.password.length >= 6 &&
    required(form.telefon) &&
    required(form.strasse) &&
    required(form.plz) &&
    required(form.ort);

  // Feldwert ändern
  const set = (field: keyof RegisterRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = field === "baujahr"
        ? (e.target.value ? Number(e.target.value) : null)
        : e.target.value;
      setForm((prev) => ({ ...prev, [field]: val }));
    };

  // Submit
  const handleRegister = async () => {
    setSubmitted(true);
    if (!isValid) return;

    setLoading(true);
    setError(null);

    try {
      await RegisterService.register(form);

      // Erfolgsmeldung für die HomePage vorbereiten
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

  // Render
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
