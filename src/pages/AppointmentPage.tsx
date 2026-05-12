/**
 * @file AppointmentPage.tsx
 * @description Multi-step appointment booking form for workshop customers.
 * @author N
 * @since 14.04.2026
 */

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Snackbar,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AuthService from "../service/AuthService";
import { createAppointment } from "../api/appointmentApi";

const SERVICES = [
  { name: "Ölwechsel",    price: "ab 49 €",  duration: "ca. 45 Min." },
  { name: "Reifenwechsel", price: "ab 39 €", duration: "ca. 30 Min." },
  { name: "Bremsservice",  price: "ab 89 €", duration: "ca. 60 Min." },
  { name: "HU / §57a",    price: "ab 35 €",  duration: "ca. 45 Min." },
  { name: "Klimaservice",  price: "ab 69 €", duration: "ca. 30 Min." },
  { name: "Inspektion",   price: "ab 120 €", duration: "ca. 90 Min." },
];

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00",
];

const STEPS = ["Leistung wählen", "Termin wählen", "Ihre Daten", "Bestätigung"];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  brand: string;
  model: string;
  buildYear: string;
  licensePlate: string;
  date: string;
  time: string;
  note: string;
}

export default function AppointmentPage() {
  const customer   = AuthService.getKunde();
  const isLoggedIn = AuthService.isLoggedIn();

  const [activeStep, setActiveStep]           = useState(0);
  const [selectedService, setSelectedService] = useState("");
  const [selectedTime, setSelectedTime]       = useState("");
  const [submitted, setSubmitted]             = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [errorMsg, setErrorMsg]               = useState<string | null>(null);
  const [snackbar, setSnackbar]               = useState<string | null>(null);

  // FIX: use correct ICustomer field names (firstName, lastName, phone)
  // The old code used non-existent alias fields: vorname, nachname, telefon, marke, modell, baujahr, kennzeichen
  const [form, setForm] = useState<FormData>({
    firstName:    customer?.firstName ?? "",
    lastName:     customer?.lastName  ?? "",
    email:        customer?.email     ?? "",
    phone:        customer?.phone     ?? "",
    brand:        "",
    model:        "",
    buildYear:    "",
    licensePlate: "",
    date: "",
    time: "",
    note: "",
  });

  const set = (field: keyof FormData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const canGoNext = (): boolean => {
    if (activeStep === 0) return !!selectedService;
    if (activeStep === 1) return !!form.date && !!selectedTime;
    if (activeStep === 2)
      return !!(form.firstName && form.lastName && form.email &&
          form.phone && form.brand && form.model && form.licensePlate);
    return true;
  };

  const handleNext = () => {
    if (activeStep === 2) setForm((p) => ({ ...p, time: selectedTime }));
    setActiveStep((s) => s + 1);
  };

  const handleBack = () => setActiveStep((s) => s - 1);

  // FIX: actually call the backend API
  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const preferredDate = `${form.date}T${selectedTime}:00`;

      await createAppointment({
        customerId:   customer?.id ?? null,
        customerName: `${form.firstName} ${form.lastName}`,
        serviceType:  selectedService,
        brand:        form.brand,
        model:        form.model,
        year:         form.buildYear ? parseInt(form.buildYear) : null,
        licensePlate: form.licensePlate,
        date:         form.date,
        time:         selectedTime,
        preferredDate,
        note:         form.note,
        price:        0,
        createdAt:    new Date().toISOString(),
      } as any);

      setSubmitted(true);
      setSnackbar("Ihr Termin wurde erfolgreich angefragt!");
    } catch (err: any) {
      const msg =
          err?.response?.data?.message ??
          err?.response?.data ??
          "Fehler beim Senden der Terminanfrage. Bitte versuchen Sie es erneut.";
      setErrorMsg(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  const StepService = (
      <Box>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
          Welche Leistung benötigen Sie?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Wählen Sie eine Leistung aus unserem Angebot.
        </Typography>
        <Grid container spacing={2}>
          {SERVICES.map((s) => (
              <Grid key={s.name} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                    variant="outlined"
                    onClick={() => setSelectedService(s.name)}
                    sx={{
                      cursor: "pointer",
                      borderColor: selectedService === s.name ? "primary.main" : "divider",
                      bgcolor:     selectedService === s.name ? "rgba(198,40,40,0.07)" : "background.paper",
                      transition:  "border-color 150ms, background-color 150ms",
                      "&:hover": { borderColor: "primary.light" },
                    }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={700}>{s.name}</Typography>
                    <Typography variant="body2" color="primary.main" sx={{ mt: 0.5 }}>{s.price}</Typography>
                    <Typography variant="caption" color="text.secondary">{s.duration}</Typography>
                  </CardContent>
                </Card>
              </Grid>
          ))}
        </Grid>
      </Box>
  );

  const StepDateTime = (
      <Box>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
          Wählen Sie Datum &amp; Uhrzeit
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Wählen Sie einen freien Termin aus.
        </Typography>
        <Stack spacing={3}>
          <TextField
              label="Datum"
              type="date"
              value={form.date}
              onChange={set("date")}
              slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: new Date().toISOString().split("T")[0] } }}
              fullWidth
          />
          {form.date && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  Verfügbare Zeitslots für{" "}
                  <strong>
                    {new Date(form.date).toLocaleDateString("de-AT", { day: "2-digit", month: "long", year: "numeric" })}
                  </strong>
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {TIME_SLOTS.map((slot) => (
                      <Chip
                          key={slot}
                          label={slot}
                          onClick={() => setSelectedTime(slot)}
                          variant={selectedTime === slot ? "filled" : "outlined"}
                          color={selectedTime === slot ? "primary" : "default"}
                          sx={{ cursor: "pointer" }}
                      />
                  ))}
                </Box>
              </Box>
          )}
        </Stack>
      </Box>
  );

  const StepCustomerData = (
      <Box>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
          Ihre Daten
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {isLoggedIn
              ? "Ihre gespeicherten Daten wurden automatisch eingetragen. Sie können diese anpassen."
              : "Bitte füllen Sie Ihre Kontakt- und Fahrzeugdaten aus."}
        </Typography>

        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, textTransform: "uppercase", letterSpacing: 1 }}>
          Kontaktdaten
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Vorname"  value={form.firstName} onChange={set("firstName")} fullWidth required />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Nachname" value={form.lastName}  onChange={set("lastName")}  fullWidth required />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="E-Mail"   type="email" value={form.email} onChange={set("email")} fullWidth required />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Telefon"  value={form.phone}     onChange={set("phone")}     fullWidth required />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, textTransform: "uppercase", letterSpacing: 1 }}>
          Fahrzeugdaten
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Marke"       value={form.brand}        onChange={set("brand")}        fullWidth required />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Modell"      value={form.model}        onChange={set("model")}        fullWidth required />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField label="Baujahr"     value={form.buildYear}    onChange={set("buildYear")}    fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField label="Kennzeichen" value={form.licensePlate} onChange={set("licensePlate")} fullWidth required />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        <TextField
            label="Anmerkungen (optional)"
            value={form.note}
            onChange={set("note")}
            multiline
            rows={3}
            fullWidth
            placeholder="z. B. besondere Hinweise zu Ihrem Fahrzeug..."
        />
      </Box>
  );

  const StepConfirmation = (
      <Box>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
          Zusammenfassung
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Bitte prüfen Sie Ihre Angaben vor dem Absenden.
        </Typography>
        <Stack spacing={2}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, textTransform: "uppercase", letterSpacing: 1 }}>
                Termin
              </Typography>
              <Grid container spacing={1}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">Leistung</Typography>
                  <Typography variant="body1" fontWeight={600}>{selectedService}</Typography>
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <Typography variant="body2" color="text.secondary">Datum</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {form.date ? new Date(form.date).toLocaleDateString("de-AT") : "–"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <Typography variant="body2" color="text.secondary">Uhrzeit</Typography>
                  <Typography variant="body1" fontWeight={600}>{selectedTime} Uhr</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, textTransform: "uppercase", letterSpacing: 1 }}>
                Kontakt
              </Typography>
              <Grid container spacing={1}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">Name</Typography>
                  <Typography variant="body1" fontWeight={600}>{form.firstName} {form.lastName}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">E-Mail</Typography>
                  <Typography variant="body1" fontWeight={600}>{form.email}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">Telefon</Typography>
                  <Typography variant="body1" fontWeight={600}>{form.phone}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, textTransform: "uppercase", letterSpacing: 1 }}>
                Fahrzeug
              </Typography>
              <Grid container spacing={1}>
                <Grid size={{ xs: 4 }}>
                  <Typography variant="body2" color="text.secondary">Marke</Typography>
                  <Typography variant="body1" fontWeight={600}>{form.brand}</Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography variant="body2" color="text.secondary">Modell</Typography>
                  <Typography variant="body1" fontWeight={600}>{form.model}</Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography variant="body2" color="text.secondary">Baujahr</Typography>
                  <Typography variant="body1" fontWeight={600}>{form.buildYear || "–"}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="text.secondary">Kennzeichen</Typography>
                  <Typography variant="body1" fontWeight={600}>{form.licensePlate}</Typography>
                </Grid>
              </Grid>
              {form.note && (
                  <>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography variant="body2" color="text.secondary">Anmerkungen</Typography>
                    <Typography variant="body2">{form.note}</Typography>
                  </>
              )}
            </CardContent>
          </Card>

          {errorMsg && (
              <Alert severity="error" onClose={() => setErrorMsg(null)}>
                {errorMsg}
              </Alert>
          )}
        </Stack>
      </Box>
  );

  if (submitted) {
    return (
        <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 }, textAlign: "center" }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 72, color: "primary.main", mb: 2 }} />
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
            Terminanfrage gesendet!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Wir haben Ihre Anfrage für einen <strong>{selectedService}</strong>-Termin am{" "}
            <strong>{form.date ? new Date(form.date).toLocaleDateString("de-AT") : ""}</strong> um{" "}
            <strong>{selectedTime} Uhr</strong> erhalten.
            <br />
            Sie erhalten in Kürze eine Bestätigung per E-Mail.
          </Typography>
          <Button variant="contained" href="/">Zurück zur Startseite</Button>
        </Container>
    );
  }

  const STEP_CONTENT = [StepService, StepDateTime, StepCustomerData, StepConfirmation];

  return (
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
            Termin anfragen
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Buchen Sie Ihren Werkstatt-Termin in wenigen Schritten online.
          </Typography>
          {isLoggedIn && (
              <Chip
                  label={`Angemeldet als ${customer?.firstName} ${customer?.lastName}`}
                  color="primary"
                  size="small"
                  sx={{ mt: 1.5 }}
              />
          )}
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {STEPS.map((label) => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            {STEP_CONTENT[activeStep]}
          </CardContent>
        </Card>

        <Stack direction="row" justifyContent="space-between">
          <Button variant="outlined" color="inherit" onClick={handleBack} disabled={activeStep === 0 || loading}>
            Zurück
          </Button>
          {activeStep < STEPS.length - 1 ? (
              <Button variant="contained" onClick={handleNext} disabled={!canGoNext()}>
                Weiter
              </Button>
          ) : (
              <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={18} color="inherit" /> : undefined}
              >
                {loading ? "Wird gesendet…" : "Termin anfragen"}
              </Button>
          )}
        </Stack>

        <Snackbar
            open={!!snackbar}
            autoHideDuration={4000}
            onClose={() => setSnackbar(null)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" onClose={() => setSnackbar(null)} sx={{ width: "100%" }}>
            {snackbar}
          </Alert>
        </Snackbar>
      </Container>
  );
}
