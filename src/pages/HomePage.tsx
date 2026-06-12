import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Grid,
    Snackbar,
    Stack,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import RegisterService from "../service/RegisterService";
import blackBmw from "../pics/blackBmw.png";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { getServices, IService } from "../api/services";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});


const WERKSTATT_POS: [number, number] = [46.794200, 15.538571];

export default function HomePage() {
    const navigate = useNavigate();
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [services, setServices] = useState<IService[]>([]);
    const [servicesLoading, setServicesLoading] = useState(true);

    useEffect(() => {
        const msg = RegisterService.popSuccessMessage();
        if (msg) setSuccessMsg(msg);
    }, []);

    useEffect(() => {
        getServices()
            .then((data) => {
                console.log("services:", data);
                setServices(data);
            })
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
                    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.25) 100%), url(${blackBmw})`,
                    backgroundSize: "cover",
                    backgroundPosition: { xs: "center", md: "right center" },
                    backgroundRepeat: "no-repeat",
                    color: "common.white",
                    display: "flex",
                    alignItems: "center",
                    mb: { xs: 4, md: 6 },
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ py: { xs: 6, md: 10 }, maxWidth: 640 }}>
                        <Typography variant="h3" component="h1" fontWeight={800} sx={{ color: "common.white" }}>
                            KFZ-Technik GDG –
                            <br />
                            Ihre Werkstatt in Leibnitz
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2, maxWidth: 520, color: "rgba(255,255,255,0.85)" }}>
                            Die Autowerkstatt, der Leibnitz vertraut.
                        </Typography>
                        <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                            <Button variant="contained" size="large" onClick={() => navigate("/termin")}>
                                Termin anfragen
                            </Button>
                            {/*
                            <Button
                                variant="outlined"
                                size="large"
                                sx={{
                                    color: "common.white",
                                    borderColor: "rgba(255,255,255,0.6)",
                                    "&:hover": { borderColor: "common.white", bgcolor: "rgba(255,255,255,0.08)" },
                                }}
                            >
                                Bewertungen ansehen
                            </Button>
                            */}
                        </Stack>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg">

                <Box sx={{ pb: 6 }}>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 2.5 }}>
                        Unsere Leistungen
                    </Typography>

                    {servicesLoading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : services.length === 0 ? (
                        <Typography color="text.secondary">Keine Leistungen verfügbar.</Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {services.slice(0, 4).map((s) => (
                                <Grid key={s.id ?? s.title} size={{ xs: 6, sm: 3 }}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            textAlign: "center",
                                            bgcolor: "background.paper",
                                            borderColor: "divider",
                                            "&:hover": { borderColor: "primary.main" },
                                            transition: "border-color 150ms",
                                            height: "100%",
                                            minHeight: 180,
                                        }}
                                    >
                                        <CardContent sx={{ p: 2.5, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                                            {s.icon && (
                                                <Box
                                                    component="img"
                                                    src={`data:image/png;base64,${s.icon}`}
                                                    alt={s.title}
                                                    sx={{
                                                        width: 56,
                                                        height: 56,
                                                        mb: 1.5,
                                                        objectFit: "contain",
                                                        bgcolor: "rgba(255,255,255,0.06)",
                                                        borderRadius: 1,
                                                        p: 0.5,
                                                    }}
                                                />
                                            )}
                                            <Typography variant="subtitle1" fontWeight={700}>
                                                {s.title}
                                            </Typography>
                                            {s.subtitle && (
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                    {s.subtitle}
                                                </Typography>
                                            )}
                                            <Typography
                                                variant="body2"
                                                color="primary.main"
                                                sx={{ mt: 1.5, cursor: "pointer", fontWeight: 600 }}
                                                onClick={() => navigate("/termin")}
                                            >
                                                Termin anfragen
                                            </Typography>
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
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 2.5 }}>
                        So finden Sie uns
                    </Typography>
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
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Grazer Straße 136, 8430 Leibnitz
                        </Typography>
                        <Button
                            variant="text"
                            size="small"
                            href="https://www.google.com/maps/search/?api=1&query=Grazer+Stra%C3%9Fe+136+Leibnitz"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            In Google Maps öffnen →
                        </Button>
                    </Stack>
                </Box>

            </Container>
        </>
    );
}