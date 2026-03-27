// LoginPage.tsx
// Anmeldeseite für bestehende Kunden.
// Der Nutzer gibt E-Mail und Passwort ein. Nach erfolgreichem Login
// wird er je nach Rolle (ADMIN / KUNDE) weitergeleitet.
// Token und Kundendaten werden vom AuthService im localStorage gespeichert. -N 27.03.2026

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

export default function LoginPage() {
  const navigate = useNavigate();

  // State -N 27.03.2026
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  // Validierung
  // Einfache Inline-Validierung: Fehler werden direkt am Feld angezeigt -N 27.03.2026
  const emailError    = email.length > 0 && !email.includes("@");
  const passwordError = password.length > 0 && password.length < 6;
  // Formular ist nur gültig wenn E-Mail und Passwort korrekt befüllt sind -N 27.03.2026
  const formValid     = email.length > 0 && password.length >= 6 && !emailError;

  //Submit
  // Sendet die Login-Daten an das Backend via AuthService -N 27.03.2026
  const handleLogin = async () => {
    if (!formValid) return;
    setLoading(true);
    setError(null);

    try {
      const result = await AuthService.login({ email, password });

      // Weiterleitung je nach Rolle -N 27.03.2026
      if (result.kunde.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: unknown) {
      // HTTP-Statuscodes aus der Fehlerantwort auslesen -N 27.03.2026
      const status = (err as { response?: { status?: number } })?.response?.status;
      // 401 = falsche Credentials, 404 = E-Mail unbekannt, sonst Serverproblem -N 27.03.2026
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

  // Enter-Taste löst den Login aus — verbessert die Tastaturnutzung -N 27.03.2026
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <Stack spacing={2.5} onKeyDown={handleKeyDown}>

      {/* Fehlermeldung -N 27.03.2026 */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* E-Mail -N 27.03.2026 */}
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

      {/* Passwort -N 27.03.2026 */}
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

      {/* Passwort vergessen -N 27.03.2026 */}
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

      {/* Login Button — deaktiviert solange Formular ungültig oder Request läuft -N 27.03.2026 */}
      <Button
        variant="contained"
        fullWidth
        disabled={!formValid || loading}
        onClick={handleLogin}
        size="large"
        sx={{ mt: 0.5 }}
      >
        {/* Ladeindikator während des API-Calls -N 27.03.2026 */}
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

      {/* Registrieren -N 27.03.2026 */}
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
