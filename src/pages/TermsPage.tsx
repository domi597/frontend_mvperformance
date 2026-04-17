/**
 * @file AGBPage.tsx
 * @description Standalone Terms and Conditions page (Allgemeine Geschäftsbedingungen) for
 * Devrim Gül (KFZ-Technik GDG).
 *
 * > **Note:** The legal text content on this page was generated with an online legal
 * > document generator and adapted to the company data of Devrim Gül (KFZ-Technik GDG).
 * > It is rendered outside of the main `PublicLayout` (no TopBar / Navbar / Footer)
 * > so that it can also be reached directly from the registration flow via the AGB checkbox.
 *
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

export const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>

      {/* ── Header ── */}
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

      {/* ── Content ── */}
      <Container maxWidth="md" sx={{ flex: 1, py: 6 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Allgemeine Geschäftsbedingungen (AGB)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Stand: {new Date().toLocaleDateString("de-AT", { year: "numeric", month: "long", day: "numeric" })}
        </Typography>

        <Stack spacing={4}>

          <Section title="§ 1 Geltungsbereich">
            <Typography variant="body2" color="text.secondary">
              Diese Allgemeinen Geschäftsbedingungen gelten für alle Leistungen und Lieferungen der
              Firma Devrim Gül (KFZ-Technik GDG), Grazer Straße 136, 8430 Leibnitz (im Folgenden
              „Auftragnehmer"), gegenüber ihren Kunden (im Folgenden „Auftraggeber"). Abweichende
              Bedingungen des Auftraggebers werden nur anerkannt, wenn der Auftragnehmer diesen
              ausdrücklich und schriftlich zugestimmt hat.
            </Typography>
          </Section>

          <Divider />

          <Section title="§ 2 Vertragsschluss & Auftragserteilung">
            <Typography variant="body2" color="text.secondary">
              Ein Vertrag kommt zustande durch die schriftliche oder mündliche Auftragserteilung
              des Auftraggebers sowie die Auftragsbestätigung durch den Auftragnehmer. Kostenvoranschläge
              sind freibleibend und unverbindlich, sofern nicht ausdrücklich eine Bindungswirkung
              vereinbart wurde. Der Auftragnehmer behält sich das Recht vor, Aufträge ohne Angabe
              von Gründen abzulehnen.
            </Typography>
          </Section>

          <Divider />

          <Section title="§ 3 Leistungsumfang">
            <Typography variant="body2" color="text.secondary">
              Der Leistungsumfang ergibt sich aus dem jeweiligen Auftrag bzw. Kostenvoranschlag.
              Zusatzleistungen, die sich erst im Zuge der Reparatur als notwendig herausstellen,
              werden dem Auftraggeber unverzüglich mitgeteilt und bedürfen dessen Zustimmung,
              sofern sie einen Mehraufwand von mehr als 15 % des ursprünglichen Kostenvoranschlags
              überschreiten.
            </Typography>
          </Section>

          <Divider />

          <Section title="§ 4 Preise & Zahlungsbedingungen">
            <Typography variant="body2" color="text.secondary">
              Alle angegebenen Preise verstehen sich in Euro inklusive der gesetzlichen Mehrwertsteuer,
              sofern nicht anders angegeben. Die Rechnung ist nach Abschluss der Leistung sofort und
              ohne Abzug fällig. Bei Zahlungsverzug werden Verzugszinsen in gesetzlicher Höhe
              verrechnet. Der Auftragnehmer ist berechtigt, das Fahrzeug bis zur vollständigen
              Bezahlung zurückzubehalten (Zurückbehaltungsrecht gemäß § 369 UGB).
            </Typography>
          </Section>

          <Divider />

          <Section title="§ 5 Termine & Fristen">
            <Typography variant="body2" color="text.secondary">
              Vereinbarte Termine sind verbindlich. Bei unvorhergesehenen Verzögerungen (z. B.
              Lieferverzögerungen bei Ersatzteilen, höhere Gewalt) wird der Auftraggeber
              schnellstmöglich informiert. Ein Rücktrittsrecht wegen geringfügiger Terminüberschreitung
              besteht nicht. Online gebuchte Termine können bis 24 Stunden vor dem vereinbarten
              Zeitpunkt kostenlos storniert oder verschoben werden.
            </Typography>
          </Section>

          <Divider />

          <Section title="§ 6 Gewährleistung">
            <Typography variant="body2" color="text.secondary">
              Die Gewährleistungsfrist beträgt 24 Monate ab Übergabe des Fahrzeugs für
              Verbraucher gemäß § 924 ABGB. Für Unternehmer beträgt die Gewährleistungsfrist
              12 Monate. Mängel sind unverzüglich nach Entdeckung schriftlich zu melden.
              Der Auftragnehmer hat das Recht zur Verbesserung oder zum Austausch. Einbauteile
              unterliegen den Gewährleistungsbedingungen des jeweiligen Herstellers.
            </Typography>
          </Section>

          <Divider />

          <Section title="§ 7 Haftung">
            <Typography variant="body2" color="text.secondary">
              Der Auftragnehmer haftet für Schäden, die durch grobe Fahrlässigkeit oder Vorsatz
              verursacht wurden. Bei leichter Fahrlässigkeit haftet der Auftragnehmer nur für
              Personenschäden. Eine Haftung für mittelbare Schäden, entgangenen Gewinn oder
              Folgeschäden ist ausgeschlossen. Der Auftragnehmer übernimmt keine Haftung für
              im Fahrzeug zurückgelassene Gegenstände.
            </Typography>
          </Section>

          <Divider />

          <Section title="§ 8 Datenschutz">
            <Typography variant="body2" color="text.secondary">
              Die Erhebung und Verarbeitung personenbezogener Daten erfolgt gemäß der
              Datenschutz-Grundverordnung (DSGVO) und dem österreichischen Datenschutzgesetz (DSG).
              Weitere Informationen entnehmen Sie bitte unserer{" "}
              <Link
                component={RouterLink}
                to="/datenschutz"
                underline="hover"
                sx={{ color: "primary.light", fontWeight: 600 }}
              >
                Datenschutzerklärung
              </Link>.
            </Typography>
          </Section>

          <Divider />

          <Section title="§ 9 Gerichtsstand & anwendbares Recht">
            <Typography variant="body2" color="text.secondary">
              Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts (CISG).
              Gerichtsstand für alle Streitigkeiten aus oder im Zusammenhang mit diesen AGB
              ist, soweit gesetzlich zulässig, Leibnitz. Für Verbraucher gelten die gesetzlichen
              Zuständigkeitsregelungen.
            </Typography>
          </Section>

          <Divider />

          <Section title="§ 10 Salvatorische Klausel">
            <Typography variant="body2" color="text.secondary">
              Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise unwirksam sein oder
              werden, so berührt dies die Gültigkeit der übrigen Bestimmungen nicht. Die
              unwirksame Bestimmung wird durch eine wirksame ersetzt, die dem wirtschaftlichen
              Zweck der unwirksamen Bestimmung möglichst nahekommt.
            </Typography>
          </Section>

        </Stack>
      </Container>

      {/* ── Footer ── */}
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
};

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
