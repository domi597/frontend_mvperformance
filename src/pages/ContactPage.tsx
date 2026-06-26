import { Box, Button, Card, CardContent, Chip, Container, Divider, Grid, Link, Stack, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CheckIcon from "@mui/icons-material/Check";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useNavigate } from "react-router-dom";


/**
 * NAME : Dominik Ranegger (KI)
 * DATE : 10.06
 * */

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const WERKSTATT_POS: [number, number] = [46.794200, 15.538571];

const CONTACT = {
    address: "Grazer Straße 136",
    city: "8430 Leibnitz, Österreich",
    phone: "+43 (0)664 1990371",
    phoneHref: "tel:+436641990371",
    email: "kfztechnik.gdg@gmail.com",
    emailHref: "mailto:kfztechnik.gdg@gmail.com",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Grazer+Stra%C3%9Fe+136+Leibnitz",
    facebook: "https://www.facebook.com/search/top?q=kfz%20technik%20gdg",
    instagram: "https://www.instagram.com/kfztechnik.gdg/",
};

function isTodayInRange(days: number[]) {
    return days.includes(new Date().getDay());
}

const HOURS = [
    { day: "Montag – Freitag", hours: "08:00 – 17:00", isToday: isTodayInRange([1, 2, 3, 4, 5]) },
    { day: "Samstag", hours: "09:00 – 13:00", isToday: isTodayInRange([6]) },
    { day: "Sonntag", hours: "Geschlossen", isToday: isTodayInRange([0]), closed: true },
];

function isOpen(): boolean {
    const now = new Date();
    const day = now.getDay(); // 0=Sun,1=Mon,...,6=Sat
    const h = now.getHours() + now.getMinutes() / 60;
    if (day >= 1 && day <= 5) return h >= 8 && h < 17;
    if (day === 6) return h >= 9 && h < 13;
    return false;
}

const ContactInfoRow = ({
                            icon,
                            label,
                            primary,
                            secondary,
                        }: {
    icon: React.ReactNode;
    label: string;
    primary: React.ReactNode;
    secondary?: string;
}) => (
    <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box
            sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                bgcolor: "error.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                mt: 0.25,
            }}
        >
            {icon}
        </Box>
        <Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600 }}>
                {label}
            </Typography>
            <Typography variant="body1" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                {primary}
            </Typography>
            {secondary && (
                <Typography variant="caption" color="text.secondary">
                    {secondary}
                </Typography>
            )}
        </Box>
    </Stack>
);

export default function ContactPage() {
    const navigate = useNavigate();
    const open = isOpen();

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>

            {/* Breadcrumb */}
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 3 }}>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ cursor: "pointer", "&:hover": { color: "text.primary" } }}
                    onClick={() => navigate("/")}
                >
                    Startseite
                </Typography>
                <Typography variant="caption" color="text.secondary">›</Typography>
                <Typography variant="caption" color="text.primary">Kontakt</Typography>
            </Stack>

            {/* Heading */}
            <Typography variant="h4" fontWeight={800} gutterBottom>
                Kontakt & Standort
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Wir sind für Sie da – persönlich, telefonisch oder per E-Mail.
            </Typography>

            <Grid container spacing={3}>

                {/* LEFT COLUMN */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Stack spacing={3}>

                        {/* Kontaktinformationen */}
                        <Card variant="outlined" sx={{ bgcolor: "background.paper", borderColor: "divider" }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography
                                    variant="overline"
                                    color="error.main"
                                    fontWeight={700}
                                    sx={{ letterSpacing: 1.5, display: "block", mb: 2.5 }}
                                >
                                    Kontaktinformationen
                                </Typography>

                                <Stack spacing={3}>
                                    <ContactInfoRow
                                        icon={<LocationOnIcon sx={{ color: "common.white", fontSize: 20 }} />}
                                        label="Adresse"
                                        primary={CONTACT.address}
                                        secondary={CONTACT.city}
                                    />
                                    <ContactInfoRow
                                        icon={<PhoneIcon sx={{ color: "common.white", fontSize: 20 }} />}
                                        label="Telefon"
                                        primary={
                                            <Link href={CONTACT.phoneHref} underline="none" color="inherit">
                                                {CONTACT.phone}
                                            </Link>
                                        }
                                        secondary="Mo–Fr 08:00–17:00 Uhr"
                                    />
                                    <ContactInfoRow
                                        icon={<EmailIcon sx={{ color: "common.white", fontSize: 20 }} />}
                                        label="E-Mail"
                                        primary={
                                            <Link href={CONTACT.emailHref} underline="none" color="inherit">
                                                {CONTACT.email}
                                            </Link>
                                        }
                                        secondary="Antwort innerhalb von 24 h"
                                    />
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Öffnungszeiten */}
                        <Card variant="outlined" sx={{ bgcolor: "background.paper", borderColor: "divider" }}>
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
                                    <Typography
                                        variant="overline"
                                        color="error.main"
                                        fontWeight={700}
                                        sx={{ letterSpacing: 1.5 }}
                                    >
                                        Öffnungszeiten
                                    </Typography>
                                    <Chip
                                        label={open ? "Geöffnet" : "Geschlossen"}
                                        size="small"
                                        sx={{
                                            bgcolor: open ? "success.dark" : "error.dark",
                                            color: "common.white",
                                            fontWeight: 700,
                                            fontSize: 11,
                                            height: 20,
                                        }}
                                    />
                                </Stack>

                                <Stack spacing={0}>
                                    {HOURS.map((row, i) => (
                                        <Box key={i}>
                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                sx={{ py: 1.25 }}
                                            >
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={row.isToday ? 700 : 400}
                                                        color={row.isToday ? "error.main" : "text.primary"}
                                                    >
                                                        {row.day}
                                                        {row.isToday && !row.day.includes("-")}
                                                    </Typography>
                                                </Stack>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={row.isToday ? 700 : 400}
                                                    color={row.isToday ? "error.main" : row.closed ? "text.disabled" : "text.primary"}
                                                >
                                                    {row.hours}
                                                </Typography>
                                            </Stack>
                                            {i < HOURS.length - 1 && <Divider sx={{ borderColor: "divider" }} />}
                                        </Box>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Karte */}
                        <Card variant="outlined" sx={{ bgcolor: "background.paper", borderColor: "divider" }}>
                            <CardContent sx={{ p: 3, pb: "12px !important" }}>
                                <Typography
                                    variant="overline"
                                    color="error.main"
                                    fontWeight={700}
                                    sx={{ letterSpacing: 1.5, display: "block", mb: 2 }}
                                >
                                    Standort
                                </Typography>
                            </CardContent>
                            <Box sx={{ borderRadius: 1, overflow: "hidden", mx: 0 }}>
                                <MapContainer
                                    center={WERKSTATT_POS}
                                    zoom={15}
                                    style={{ height: 220, width: "100%" }}
                                    scrollWheelZoom={false}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={WERKSTATT_POS}>
                                        <Popup>
                                            <strong>KFZ-Technik GDG</strong><br />
                                            Grazer Straße 136<br />
                                            8430 Leibnitz
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </Box>
                            <CardContent sx={{ px: 3, pt: 1.5, pb: "12px !important" }}>
                                <Typography variant="body2" color="text.secondary">
                                    Grazer Straße 136, 8430 Leibnitz
                                </Typography>
                            </CardContent>
                        </Card>

                        {/* Social Media */}
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="outlined"
                                startIcon={<FacebookIcon />}
                                href={CONTACT.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ flex: 1, borderColor: "#1877F2", color: "#1877F2", "&:hover": { bgcolor: "rgba(24,119,242,0.08)", borderColor: "#1877F2" } }}
                            >
                                Facebook
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<InstagramIcon />}
                                href={CONTACT.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ flex: 1, borderColor: "#E1306C", color: "#E1306C", "&:hover": { bgcolor: "rgba(225,48,108,0.08)", borderColor: "#E1306C" } }}
                            >
                                Instagram
                            </Button>
                        </Stack>

                    </Stack>
                </Grid>

                {/* RIGHT COLUMN */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Stack spacing={3} sx={{ position: { md: "sticky" }, top: { md: 24 } }}>

                        {/* Termin CTA */}
                        <Card variant="outlined" sx={{ bgcolor: "background.paper", borderColor: "divider" }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                    Termin vereinbaren
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                                    Buchen Sie Ihren Werkstatttermin schnell und unkompliziert direkt online – rund um die Uhr verfügbar.
                                </Typography>

                                <Stack spacing={1} sx={{ mb: 3 }}>
                                    {[
                                        "Leistung & Fahrzeug auswählen",
                                        "Wunschdatum und Uhrzeit wählen",
                                        "Sofortige Bestätigung per E-Mail",
                                    ].map((item) => (
                                        <Stack key={item} direction="row" spacing={1} alignItems="center">
                                            <CheckIcon sx={{ color: "success.main", fontSize: 18 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {item}
                                            </Typography>
                                        </Stack>
                                    ))}
                                </Stack>

                                <Button
                                    variant="contained"
                                    color="error"
                                    fullWidth
                                    size="large"
                                    onClick={() => navigate("/termin")}
                                    sx={{ fontWeight: 700 }}
                                >
                                    Termin anfragen
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Anfahrt & Parken */}
                        <Card variant="outlined" sx={{ bgcolor: "background.paper", borderColor: "divider" }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                    Anfahrt & Parken
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                                    Kostenlose Parkplätze direkt vor der Werkstatt.
                                </Typography>

                                <Button
                                    variant="outlined"
                                    color="error"
                                    fullWidth
                                    href={CONTACT.mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ fontWeight: 700 }}
                                >
                                    Route berechnen
                                </Button>
                            </CardContent>
                        </Card>

                    </Stack>
                </Grid>

            </Grid>
        </Container>
    );
}
