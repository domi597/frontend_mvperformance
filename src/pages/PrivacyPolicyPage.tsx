/**
 * Privacy policy page as required by GDPR and the Austrian DSG.
 * Rendered outside `PublicLayout` so it is reachable directly from the registration and login flows.
 * Designed in collaboration with AI (Claude by Anthropic).
 * @author N
 * @since 10.04.2026
 */

import {
  Box,
  Container,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link as RouterLink, useNavigate } from "react-router-dom";

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

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
        <IconButton size="small" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowBackIcon fontSize="small" />
        </IconButton>
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

          <Section title="3. Zweck der Datenverarbeitung">
            <Typography variant="body2" color="text.secondary">
              Ihre Daten werden ausschließlich für folgende Zwecke verwendet:
            </Typography>
            <Box component="ul" sx={{ pl: 3, mt: 1 }}>
              {[
                "Verwaltung Ihres Kundenkontos",
                "Buchung und Verwaltung von Werkstattterminen",
                "Kommunikation bezüglich Ihrer Aufträge",
              ].map((item) => (
                <Typography key={item} component="li" variant="body2" color="text.secondary">
                  {item}
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
          </Section>

          <Divider />

          <Section title="6. Cookies">
            <Typography variant="body2" color="text.secondary">
              Diese Website verwendet ausschließlich technisch notwendige Cookies (z. B. Session-Token
              im localStorage), die für den Betrieb der Plattform erforderlich sind.
              Es werden keine Tracking- oder Marketing-Cookies eingesetzt.
            </Typography>
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
