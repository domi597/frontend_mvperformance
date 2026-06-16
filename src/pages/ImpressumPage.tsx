/**
 * @description Legal imprint page as required by Austrian law (§ 5 ECG).
 * Rendered outside `PublicLayout` so it is reachable directly from the registration and login flows.
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

export default function ImpressumPage() {
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
          Impressum
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Angaben gemäß § 5 ECG (E-Commerce-Gesetz)
        </Typography>

        <Stack spacing={4}>

          <Section title="Unternehmensangaben">
            <Typography variant="body2" color="text.secondary" component="div">
              <strong>Devrim Gül (KFZ-Technik GDG)</strong><br />
              Grazer Straße 136<br />
              8430 Leibnitz<br />
              Österreich
            </Typography>
          </Section>

          <Divider />

          <Section title="Kontakt">
            <Typography variant="body2" color="text.secondary" component="div">
              Telefon: <Link href="tel:+436641990371" underline="hover" sx={{ color: "primary.light" }}>0664 1990371</Link><br />
              E-Mail: <Link href="mailto:kfztechnik.gdg@gmail.com" underline="hover" sx={{ color: "primary.light" }}>kfztechnik.gdg@gmail.com</Link>
            </Typography>
          </Section>

          <Divider />

          <Section title="Gewerbliche Information">
            <Typography variant="body2" color="text.secondary" component="div">
              Berufsrecht: Kraftfahrzeugtechniker<br />
              Zuständige Kammer: Wirtschaftskammer Steiermark<br />
              Anwendbare Rechtsvorschrift: Gewerbeordnung (GewO) –{" "}
              <Link
                href="https://www.ris.bka.gv.at"
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{ color: "primary.light" }}
              >
                www.ris.bka.gv.at
              </Link>
            </Typography>
          </Section>

          <Divider />

          <Section title="Aufsichtsbehörde">
            <Typography variant="body2" color="text.secondary">
              Bezirkshauptmannschaft Leibnitz, Kadagasse 14, 8430 Leibnitz
            </Typography>
          </Section>

          <Divider />

          <Section title="Haftungsausschluss">
            <Typography variant="body2" color="text.secondary">
              Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die
              Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernehmen wir jedoch keine
              Gewähr. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 ECG für eigene Inhalte auf
              diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
            </Typography>
          </Section>

          <Divider />

          <Section title="Urheberrecht">
            <Typography variant="body2" color="text.secondary">
              Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
              unterliegen dem österreichischen Urheberrecht. Die Vervielfältigung, Bearbeitung,
              Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts
              bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
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
