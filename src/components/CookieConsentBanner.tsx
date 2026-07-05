import { Box, Button, Container, Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useCookieConsent } from "../hooks/useCookieConsent";

export default function CookieConsentBanner() {
    const { bannerOpen, status, acceptAll, acceptNecessaryOnly } = useCookieConsent();

    if (!bannerOpen) return null;

    return (
        <Box
            role="dialog"
            aria-modal="false"
            aria-live="polite"
            aria-label="Cookie-Einstellungen"
            sx={{
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 2000,
                bgcolor: "background.paper",
                borderTop: 1,
                borderColor: "divider",
                boxShadow: "0 -4px 20px rgba(0,0,0,0.35)",
            }}
        >
            <Container maxWidth="lg" sx={{ py: 2.5 }}>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    alignItems={{ xs: "stretch", md: "center" }}
                >
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                            Cookies
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Wir verwenden ausschließlich technisch notwendige Speicherung
                            (z.&nbsp;B. Ihre Login-Session), damit die Plattform funktioniert.
                            Mit Ihrer Zustimmung speichern wir zusätzlich Ihre Anzeige-Präferenz
                            (Dark/Light-Mode) dauerhaft in Ihrem Browser. Details finden Sie in
                            unserer{" "}
                            <Link component={RouterLink} to="/datenschutz" underline="hover">
                                Datenschutzerklärung
                            </Link>
                            .
                        </Typography>
                    </Box>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ flexShrink: 0 }}>
                        <Button variant="outlined" color="inherit" onClick={acceptNecessaryOnly}>
                            Nur notwendige
                        </Button>
                        <Button variant="contained" color="primary" onClick={acceptAll}>
                            Alle akzeptieren
                        </Button>
                    </Stack>
                </Stack>
                {status !== null && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                        Aktuelle Einstellung: {status === "all" ? "Alle akzeptiert" : "Nur notwendige"} —
                        wählen Sie erneut, um sie zu ändern.
                    </Typography>
                )}
            </Container>
        </Box>
    );
}