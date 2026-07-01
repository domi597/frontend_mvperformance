import { useEffect, useState } from "react";
import {Alert, Box, Button, Card, CardContent, CircularProgress, Container, Grid, Snackbar, Stack, Typography,} from "@mui/material";
import { useNavigate } from "react-router-dom";
import RegisterService from "../service/RegisterService";
import blackBmw from "../pics/blackBmw.png";
import redBmw from "../pics/redBmw.png";
import { useGlobalTheme } from "../hooks/useGlobalTheme";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { getServices, IService } from "../api/services";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import NearMeRoundedIcon from "@mui/icons-material/NearMeRounded";


/**
 * Created by: Dominik Ranegger (KI)
 * Date: 22.06.2026
 * Time: 14:53
 */


delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const WERKSTATT_POS: [number, number] = [46.794200, 15.538571];

export default function HomePage() {
    const navigate = useNavigate();
    const { isDark } = useGlobalTheme();
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [services, setServices] = useState<IService[]>([]);
    const [servicesLoading, setServicesLoading] = useState(true);

    useEffect(() => {
        const msg = RegisterService.popSuccessMessage();
        if (msg) setSuccessMsg(msg);
    }, []);

    useEffect(() => {
        getServices()
            .then((data) => setServices(data))
            .catch(() => setServices([]))
            .finally(() => setServicesLoading(false));
    }, []);

    return (
        <>
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

            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    minHeight: { xs: 360, md: 520 },
                    backgroundImage: isDark
                        ? `linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.25) 100%), url(${blackBmw})`
                        : `linear-gradient(to right, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.6) 45%, rgba(255,255,255,0.15) 100%), url(${redBmw})`,
                    backgroundSize: "cover",
                    backgroundPosition: { xs: "center", md: "right center" },
                    backgroundRepeat: "no-repeat",
                    display: "flex",
                    alignItems: "center",
                    mb: { xs: 4, md: 6 },
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ py: { xs: 6, md: 10 }, maxWidth: 640 }}>
                        <Typography variant="h3" component="h1" fontWeight={800} sx={{ color: isDark ? "common.white" : "text.primary" }}>
                            KFZ-Technik GDG –
                            <br />
                            Ihre Werkstatt in Leibnitz
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2, maxWidth: 520, color: isDark ? "rgba(255,255,255,0.85)" : "text.secondary" }}>
                            Die Autowerkstatt, der Leibnitz vertraut.
                        </Typography>
                        <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                            <Button variant="contained" size="large" onClick={() => navigate("/termin")}>
                                Termin anfragen
                            </Button>
                        </Stack>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg">
                <Box sx={{ pb: 6 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 3 }}>
                        <Box>
                            <Typography variant="overline" sx={{ color: "primary.main", fontWeight: 700, letterSpacing: 1.5 }}>
                                WAS WIR ANBIETEN
                            </Typography>
                            <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
                                Unsere Leistungen
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Professionelle KFZ-Arbeiten — schnell, transparent und zu fairen Preisen.
                            </Typography>
                        </Box>
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/leistungen")}
                            sx={{
                                flexShrink: 0,
                                display: { xs: "none", sm: "inline-flex" },
                                color: "#d32f2f",
                                borderColor: "rgba(211, 47, 47, 0.5)",
                                textTransform: "none",
                                fontWeight: 600,
                                fontSize: "0.95rem",
                                borderRadius: "8px",
                                padding: "6px 20px",
                                transition: "all 0.2s ease-in-out",
                                "&:hover": {
                                    borderColor: "#d32f2f",
                                    backgroundColor: "rgba(211, 47, 47, 0.08)",
                                },
                            }}
                        >
                            Alle Leistungen ansehen
                        </Button>
                    </Stack>

                    {servicesLoading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : services.length === 0 ? (
                        <Typography color="text.secondary">Keine Leistungen verfügbar.</Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {services.slice(0, 4).map((s) => (
                                <Grid key={s.id ?? s.title} size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            bgcolor: "background.paper",
                                            borderColor: "divider",
                                            "&:hover": {
                                                borderColor: "primary.main",
                                                transform: "translateY(-4px)",
                                            },
                                            transition: "border-color 150ms, transform 150ms",
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <CardContent sx={{
                                            p: 2.5,
                                            display: "flex",
                                            flexDirection: "column",
                                            height: "100%",
                                        }}>
                                            {s.icon && (
                                                <Box
                                                    component="img"
                                                    src={`data:image/png;base64,${s.icon}`}
                                                    alt={s.title}
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        mb: 1.5,
                                                        objectFit: "contain",
                                                        bgcolor: "action.hover",
                                                        borderRadius: 2,
                                                        p: 0.5,
                                                    }}
                                                />
                                            )}

                                            <Typography variant="subtitle1" fontWeight={700}>
                                                {s.title}
                                            </Typography>
                                            {s.subtitle && (
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                                                    {s.subtitle}
                                                </Typography>
                                            )}

                                            <Box sx={{ flexGrow: 1 }} />

                                            <Box sx={{ borderTop: "1px solid", borderColor: "divider", my: 1.5 }} />

                                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                                <Typography variant="h6" fontWeight={700} color="text.primary">
                                                    {s.price} €
                                                </Typography>
                                                {s.duration && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        ⏱ {s.duration} min
                                                    </Typography>
                                                )}
                                            </Stack>

                                            <Button
                                                variant="contained"
                                                fullWidth
                                                size="small"
                                                onClick={() => navigate("/termin", { state: { serviceId: s.id } })}
                                            >
                                                Termin anfragen
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                </Box>

                <Card
                    variant="outlined"
                    sx={{ mb: 4, bgcolor: "background.paper", borderColor: "divider" }}
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

                <Box sx={{ pb: 6 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 2.5 }}>
                        <Typography variant="h5" fontWeight={700}>
                            So finden Sie uns
                        </Typography>
                    </Stack>
                    <Card variant="outlined" sx={{ overflow: "hidden", borderColor: "divider" }}>
                        <MapContainer
                            center={WERKSTATT_POS}
                            zoom={15}
                            style={{ height: 380, width: "100%" }}
                            scrollWheelZoom={false}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={WERKSTATT_POS}>
                                <Popup>
                                    <strong>KFZ-Technik GDG</strong>
                                    <br />
                                    Grazer Straße 136
                                    <br />
                                    8430 Leibnitz
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </Card>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        flexWrap="wrap"
                        spacing={1.5}
                        sx={{
                            mt: 2,
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "background.paper",
                            border: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    bgcolor: "action.hover",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <LocationOnRoundedIcon color="primary" />
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" fontWeight={700}>
                                    KFZ-Technik GDG
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Grazer Straße 136, 8430 Leibnitz
                                </Typography>
                            </Box>
                        </Stack>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<NearMeRoundedIcon />}
                            href="https://www.google.com/maps/search/?api=1&query=Grazer+Stra%C3%9Fe+136+Leibnitz"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ flexShrink: 0 }}
                        >
                            Route planen
                        </Button>
                    </Stack>
                </Box>
            </Container>
        </>
    );
}