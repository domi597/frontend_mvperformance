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
            <Link variant="caption" color="text.secondary" underline="hover" href={"https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=/maps/place//data%3D!4m2!3m1!1s0x476fa58281e7208b:0x7583b1c7a9607fd8%3Fsa%3DX%26ved%3D1t:8290%26ictx%3D111&ved=2ahUKEwj1kOvV0KGUAxVhQf4FHUZoMaIQ4kB6BAgoEAM&usg=AOvVaw3-fnMzHRou0-MorBxHXpQ_"}>
            Gaindorf an der Sulm 1
              <br />
              8430 Leibnitz
            </Link>
          </Grid>

          {/* Kontakt */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              Kontakt
            </Typography>
            <Link
                href="mailto:office@kfz-gdg.at"
                underline="hover"
                variant="caption"
                color="text.secondary"
            >
              Tel: +43 (0)3452 82741
            </Link>
              <br/>
              <Link
                  href="tel:+4334528274"
                  underline="hover"
                  variant="caption"
                  color="text.secondary"
              > E-Mail: office@kfz-gdg.at
              </Link>
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
