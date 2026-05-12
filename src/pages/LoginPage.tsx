/**
 * @file LoginPage.tsx
 * @description Anmeldeseite für bestehende Kunden.
 * Nach erfolgreicher Anmeldung wird der JWT-Token via {@link AuthService} gespeichert
 * und der Nutzer rollenbasiert weitergeleitet (`ADMIN` → `/admin`, sonst `/`).
 * @author N
 * @since 27.03.2026
 */

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AuthService from "../service/AuthService";

/**
 * Rendert das Anmeldeformular mit E-Mail- und Passwortfeld.
 * Inline-Validierung gibt sofortiges Feedback während der Eingabe.
 * @returns Anmeldeformular in einem MUI `Stack`.
 */
export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  const emailError    = email.length > 0 && !email.includes("@");
  const passwordError = password.length > 0 && password.length < 6;
  const formValid     = email.length > 0 && password.length >= 6 && !emailError;

  /**
   * Sendet die Anmeldedaten an den Server und leitet nach Erfolg weiter.
   * HTTP-Fehlercodes werden auf benutzerfreundliche Meldungen gemappt
   * (`401` falsches Passwort, `404` E-Mail nicht gefunden, sonst Server-Fehler).
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
        navigate("/");
      }
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401) {
        setError("E-Mail oder Passwort ist falsch.");
      } else if (status === 404) {
        setError("Kein Konto mit dieser E-Mail gefunden.");
      } else {
        setError("Server nicht erreichbar. Bitte später versuchen.");
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Ermöglicht das Absenden des Formulars per Enter-Taste.
   * @param e - Tastaturevent des umgebenden `Stack`.
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
            disabled={!formValid || loading}
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
