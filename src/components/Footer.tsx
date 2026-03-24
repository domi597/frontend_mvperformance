import { Box, Container, Divider, Grid, Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Firma */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="subtitle1" fontWeight={800} gutterBottom>
              <Box component="span" sx={{ color: "primary.main" }}>
                KFZ
              </Box>
              -Technik GDG
            </Typography>
            <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
              Gaindorf an der Sulm 1
              <br />
              8430 Leibnitz
            </Typography>
          </Grid>

          {/* Kontakt */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              Kontakt
            </Typography>
            <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
              Tel: +43 (0)3452 82741
              <br />
              E-Mail: office@kfz-gdg.at
            </Typography>
          </Grid>

          {/* Rechtliches */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              Rechtliches
            </Typography>
            <Stack spacing={0.8}>
              <Link
                component={RouterLink}
                to="/impressum"
                underline="hover"
                variant="body2"
                color="text.secondary"
              >
                Impressum
              </Link>
              <Link
                component={RouterLink}
                to="/datenschutz"
                underline="hover"
                variant="body2"
                color="text.secondary"
              >
                Datenschutz
              </Link>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="caption" color="text.secondary">
          &copy; {new Date().getFullYear()} KFZ-Technik GDG. Alle Rechte
          vorbehalten.
        </Typography>
      </Container>
    </Box>
  );
}
