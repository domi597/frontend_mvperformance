import {Box, Button, Container, Divider, Link, Stack, Typography,} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useCookieConsent } from "../state/CookieConsentContext";

export default function PrivacyPolicyPage() {
    const { status, openSettings } = useCookieConsent();

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>

            <Box
                sx={{
                    height: 56,
                    borderBottom: 1,
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    px: 2,
                    gap: 1.5,
                }}
            >
                <Link
                    component={RouterLink}
                    to="/"
                    underline="none"
                    sx={{ fontWeight: 800, fontSize: 18, color: "#fff" }}
                >
                    <Box component="span" sx={{ color: "primary.main" }}>KFZ</Box>
                    -Technik GDG
                </Link>
            </Box>

            <Container maxWidth="md" sx={{ flex: 1, py: 6 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Datenschutzerklärung
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                    Stand: {new Date().toLocaleDateString("de-AT", { year: "numeric", month: "long", day: "numeric" })}
                </Typography>

                <Stack spacing={4}>

                    <Section title="1. Verantwortlicher">
                        <Typography variant="body2" color="text.secondary" component="div">
                            Devrim Gül (KFZ-Technik GDG)<br />
                            Grazer Straße 136<br />
                            8430 Leibnitz<br />
                            E-Mail: <Link href="mailto:kfztechnik.gdg@gmail.com" underline="hover" sx={{ color: "primary.light" }}>kfztechnik.gdg@gmail.com</Link>
                        </Typography>
                    </Section>

                    <Divider />

                    <Section title="2. Welche Daten wir erheben">
                        <Typography variant="body2" color="text.secondary">
                            Bei der Registrierung erheben wir folgende personenbezogene Daten:
                        </Typography>
                        <Box component="ul" sx={{ pl: 3, mt: 1, color: "text.secondary" }}>
                            {[
                                "Vor- und Nachname",
                                "E-Mail-Adresse",
                                "Telefonnummer",
                                "Postanschrift (Straße, PLZ, Ort)",
                                "Fahrzeugdaten (optional: Marke, Modell, Baujahr, Kennzeichen)",
                            ].map((item) => (
                                <Typography key={item} component="li" variant="body2" color="text.secondary">
                                    {item}
                                </Typography>
                            ))}
                        </Box>
                    </Section>

                    <Divider />

                    <Section title="3. Zweck der Datenverarbeitung und Rechtsgrundlage">
                        <Typography variant="body2" color="text.secondary">
                            Ihre Daten werden ausschließlich für folgende Zwecke und auf folgender
                            Rechtsgrundlage gemäß Art. 6 DSGVO verwendet:
                        </Typography>
                        <Box component="ul" sx={{ pl: 3, mt: 1 }}>
                            {[
                                {
                                    zweck: "Verwaltung Ihres Kundenkontos",
                                    basis: "Art. 6 Abs. 1 lit. b DSGVO (Erfüllung eines Vertrags bzw. vorvertragliche Maßnahmen)",
                                },
                                {
                                    zweck: "Buchung und Verwaltung von Werkstattterminen",
                                    basis: "Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)",
                                },
                                {
                                    zweck: "Kommunikation bezüglich Ihrer Aufträge",
                                    basis: "Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Auftragsabwicklung)",
                                },
                                {
                                    zweck: "Erfüllung gesetzlicher Aufbewahrungspflichten (z. B. Rechnungslegung)",
                                    basis: "Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung)",
                                },
                            ].map((item) => (
                                <Typography key={item.zweck} component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    <strong>{item.zweck}</strong> — {item.basis}
                                </Typography>
                            ))}
                        </Box>
                    </Section>

                    <Divider />

                    <Section title="4. Speicherdauer">
                        <Typography variant="body2" color="text.secondary">
                            Ihre personenbezogenen Daten werden so lange gespeichert, wie es für die oben genannten
                            Zwecke erforderlich ist oder gesetzliche Aufbewahrungspflichten dies verlangen.
                            Nach Löschung Ihres Kontos werden Ihre Daten innerhalb von 30 Tagen gelöscht,
                            sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
                        </Typography>
                    </Section>

                    <Divider />

                    <Section title="5. Ihre Rechte">
                        <Typography variant="body2" color="text.secondary">
                            Gemäß DSGVO haben Sie folgende Rechte:
                        </Typography>
                        <Box component="ul" sx={{ pl: 3, mt: 1 }}>
                            {[
                                "Recht auf Auskunft (Art. 15 DSGVO)",
                                "Recht auf Berichtigung (Art. 16 DSGVO)",
                                "Recht auf Löschung (Art. 17 DSGVO)",
                                "Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)",
                                "Recht auf Datenübertragbarkeit (Art. 20 DSGVO)",
                                "Widerspruchsrecht (Art. 21 DSGVO)",
                            ].map((item) => (
                                <Typography key={item} component="li" variant="body2" color="text.secondary">
                                    {item}
                                </Typography>
                            ))}
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Zur Ausübung Ihrer Rechte wenden Sie sich bitte an: office@kfz-technik-gdg.at
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            Darüber hinaus haben Sie das <strong>Recht auf Beschwerde bei einer
                            Aufsichtsbehörde</strong> (Art. 77 DSGVO), wenn Sie der Ansicht sind, dass die
                            Verarbeitung Ihrer personenbezogenen Daten gegen die DSGVO verstößt. Die für
                            Österreich zuständige Aufsichtsbehörde ist:
                        </Typography>
                        <Typography variant="body2" color="text.secondary" component="div" sx={{ mt: 1 }}>
                            Österreichische Datenschutzbehörde<br />
                            Barichgasse 40–42, 1030 Wien<br />
                            E-Mail: <Link href="mailto:dsb@dsb.gv.at" underline="hover" sx={{ color: "primary.light" }}>dsb@dsb.gv.at</Link>
                            {" "}·{" "}
                            <Link href="https://www.dsb.gv.at" target="_blank" rel="noopener noreferrer" underline="hover" sx={{ color: "primary.light" }}>
                                www.dsb.gv.at
                            </Link>
                        </Typography>
                    </Section>

                    <Divider />

                    <Section title="6. Cookies und lokale Speicherung">
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                            Diese Website setzt keine klassischen Cookies, sondern nutzt vergleichbare
                            Speichertechnologien des Browsers (sessionStorage/localStorage). Für diese gelten
                            gemäß § 165 TKG 2021 (Umsetzung der ePrivacy-Richtlinie) dieselben Regeln wie für
                            Cookies. Wir unterscheiden zwei Kategorien:
                        </Typography>
                        <Box component="ul" sx={{ pl: 3, mt: 1 }}>
                            <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                <strong>Technisch notwendig (keine Einwilligung erforderlich):</strong> Ihr
                                Login-Token und Ihre Nutzerdaten werden nur für die Dauer der Browser-Sitzung im
                                sessionStorage gespeichert (automatische Löschung beim Schließen des Tabs) und
                                sind für die Anmeldung sowie Terminverwaltung zwingend erforderlich. Ebenso
                                notwendig ist die Speicherung Ihrer Cookie-Entscheidung selbst.
                            </Typography>
                            <Typography component="li" variant="body2" color="text.secondary">
                                <strong>Funktional, nur mit Zustimmung:</strong> Ihre Anzeige-Präferenz
                                (Dark/Light-Mode) wird ausschließlich dann dauerhaft im localStorage gespeichert,
                                wenn Sie im Cookie-Banner „Alle akzeptieren“ gewählt haben. Wählen Sie „Nur
                                notwendige“, gilt Ihre Auswahl nur für die aktuelle Sitzung.
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                            Es werden keine Tracking-, Analyse- oder Marketing-Cookies eingesetzt und keine
                            Daten an Dritte zu Werbezwecken weitergegeben.
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Aktuelle Einstellung:{" "}
                                {status === "all"
                                    ? "Alle akzeptiert"
                                    : status === "necessary"
                                        ? "Nur notwendige"
                                        : "Noch keine Auswahl getroffen"}
                            </Typography>
                            <Button variant="outlined" size="small" onClick={openSettings}>
                                Cookie-Einstellungen ändern
                            </Button>
                        </Box>
                    </Section>

                    <Divider />

                    <Section title="7. Datensicherheit">
                        <Typography variant="body2" color="text.secondary">
                            Wir treffen angemessene technische und organisatorische Maßnahmen, um Ihre Daten
                            vor unbefugtem Zugriff, Verlust oder Missbrauch zu schützen. Die Übertragung erfolgt
                            verschlüsselt über HTTPS.
                        </Typography>
                    </Section>

                </Stack>
            </Container>

            <Box
                sx={{
                    borderTop: 1,
                    borderColor: "divider",
                    py: 2,
                    px: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="caption" color="text.secondary">
                    &copy; {new Date().getFullYear()} Devrim Gül – KFZ-Technik GDG
                </Typography>
                <Link
                    component={RouterLink}
                    to="/"
                    underline="hover"
                    variant="caption"
                    sx={{ color: "text.secondary", fontWeight: 600 }}
                >
                    Zur Startseite
                </Link>
            </Box>

        </Box>
    );
}

/** Small helper to render a titled section. */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
                {title}
            </Typography>
            {children}
        </Box>
    );
}
