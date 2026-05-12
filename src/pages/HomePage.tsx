import { useEffect, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Container, Grid, Snackbar, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RegisterService from "../service/RegisterService";

const LEISTUNGEN = [
  { name: "Ölwechsel", preis: "ab 49 \u20AC" },
  { name: "Reifenwechsel", preis: "ab 39 \u20AC" },
  { name: "Bremsservice", preis: "ab 89 \u20AC" },
  { name: "HU / \u00A757a", preis: "ab 35 \u20AC" },
];

export default function HomePage() {
  const navigate = useNavigate();

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const msg = RegisterService.popSuccessMessage();
    if (msg) setSuccessMsg(msg);
  }, []);

  return (
    <Container maxWidth="lg">

      <Snackbar
        open={!!successMsg}
        autoHideDuration={5000}
        onClose={() => setSuccessMsg(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSuccessMsg(null)} sx={{ width: "100%" }}>
          {successMsg}
        </Alert>
      </Snackbar>
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Typography variant="h3" component="h1" fontWeight={800}>
          KFZ-Technik GDG –
          <br />
          Ihre Werkstatt in Leibnitz
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 1, maxWidth: 520 }}
        >
          Die Autowerkstatt, der Leibnitz vertraut.
        </Typography>
        <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/termin")}
          >
            Termin anfragen
          </Button>
          <Button variant="outlined" size="large" color="inherit">
            Bewertungen ansehen
          </Button>
        </Stack>
      </Box>

      <Box sx={{ pb: 6 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 2.5 }}>
          Unsere Leistungen
        </Typography>
        <Grid container spacing={2}>
          {LEISTUNGEN.map((l) => (
            <Grid key={l.name} size={{ xs: 6, sm: 3 }}>
              <Card
                variant="outlined"
                sx={{
                  textAlign: "center",
                  bgcolor: "background.paper",
                  borderColor: "divider",
                  "&:hover": { borderColor: "primary.main" },
                  transition: "border-color 150ms",
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {l.name}
                  </Typography>
                  <Typography variant="body2" color="primary.main" sx={{ mt: 0.5 }}>
                    {l.preis}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Card
        variant="outlined"
        sx={{
          mb: 4,
          bgcolor: "background.paper",
          borderColor: "divider",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Termin vereinbaren
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Buchen Sie jetzt Ihren Werkstatt-Termin online.
            </Typography>
          </Box>
          <Button variant="contained" onClick={() => navigate("/termin")}>
            Jetzt Termin anfragen
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
