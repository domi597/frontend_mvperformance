/**
 * @file LoginPage.tsx
 * @description Login page for existing customers.
 *
 * The user enters their email address and password. On a successful login
 * the JWT token and customer data are persisted by {@link AuthService} in
 * `localStorage`. The user is then redirected based on their role:
 * - `ADMIN` → `/admin`
 * - `KUNDE` → `/` (home)
 *
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
 * `LoginPage` renders the sign-in form with email and password fields.
 *
 * ## State
 * | Variable       | Purpose                                                |
 * |----------------|--------------------------------------------------------|
 * | `email`        | Controlled value of the email input                    |
 * | `password`     | Controlled value of the password input                 |
 * | `showPassword` | Toggles the password field between `text` and `password` |
 * | `loading`      | Shows a spinner while the API request is in flight     |
 * | `error`        | Holds an error message string on login failure         |
 *
 * ## Validation (inline, shown while typing)
 * - `emailError`    — email contains at least one character but no `@`
 * - `passwordError` — password has been started but is shorter than 6 characters
 * - `formValid`     — both fields pass; enables the submit button
 *
 * @returns The login form wrapped in a MUI `Stack`.
 */
export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  /** Controls whether the password is rendered as plain text or dots. */
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  /**
   * Inline validation flags.
   * Errors appear as soon as the user starts typing (no submit required),
   * giving immediate feedback without blocking the initial render.
   */
  const emailError    = email.length > 0 && !email.includes("@");
  const passwordError = password.length > 0 && password.length < 6;
  /** The form is only considered valid when both fields are non-empty and error-free. */
  const formValid     = email.length > 0 && password.length >= 6 && !emailError;

  /**
   * Submits the login credentials to the backend via {@link AuthService}.
   *
   * HTTP error codes are mapped to user-friendly messages:
   * - `401` — wrong email or password
   * - `404` — no account found for this email
   * - anything else — server unreachable / unexpected error
   */
  const handleLogin = async () => {
    if (!formValid) return;
    setLoading(true);
    setError(null);

    try {
      const result = await AuthService.login({ email, password });

      // Redirect based on the authenticated user's role.
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
   * Allows the user to submit the form by pressing **Enter**,
   * improving keyboard accessibility.
   *
   * @param e - The keyboard event from the surrounding `Stack`.
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
      <Stack spacing={2.5} onKeyDown={handleKeyDown}>

        {/* Error banner — dismissed by the user via the close button */}
        {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
        )}

        {/* Email field */}
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

        {/* Password field with show/hide toggle */}
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

        {/* Forgot password link */}
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

        {/* Submit button — disabled while the form is invalid or the request is in flight */}
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

        {/* Link to registration */}
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
