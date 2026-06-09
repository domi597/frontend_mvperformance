import {
    Box,
    Card,
    CardContent,
    Container,
    Divider,
    Grid,
    Link,
    Stack,
    Typography,
} from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

const OWNER_PHOTO: string | null = null;

//const OWNER_PHOTO = devrimFoto; // import devrimFoto from "../pics/devrim.jpg"

const VALUES = [
    {
        icon: <BuildIcon sx={{ fontSize: 24, color: "error.main" }} />,
        title: "Qualität",
        desc: "Sorgfältige Arbeit an jedem Fahrzeug",
    },
    {
        icon: <FavoriteIcon sx={{ fontSize: 24, color: "error.main" }} />,
        title: "Vertrauen",
        desc: "Ehrliche Beratung ohne Verstecktes",
    },
    {
        icon: <AccessTimeIcon sx={{ fontSize: 24, color: "error.main" }} />,
        title: "Pünktlichkeit",
        desc: "Termine werden eingehalten",
    },
];


export default function AboutUsPage() {
    const navigate = useNavigate();

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
                <Typography variant="caption" color="text.primary">Über uns</Typography>
            </Stack>

            {/* Heading */}
            <Typography variant="h4" fontWeight={800} gutterBottom>
                Über uns
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Ihre Werkstatt in Leibnitz – persönlich, kompetent und zuverlässig.
            </Typography>

            {/* Inhaber Card */}
            <Card variant="outlined" sx={{ bgcolor: "background.paper", borderColor: "divider", mb: 2 }}>
                <CardContent sx={{ p: 3 }}>
                    <Typography
                        variant="overline"
                        color="error.main"
                        fontWeight={700}
                        sx={{ letterSpacing: 1.5, display: "block", mb: 2.5 }}
                    >
                        Der Betrieb
                    </Typography>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="flex-start">

                        {/* Foto / Platzhalter */}
                        {OWNER_PHOTO ? (
                            <Box
                                component="img"
                                src={OWNER_PHOTO}
                                alt="Devrim Gül"
                                sx={{
                                    width: 110,
                                    height: 130,
                                    borderRadius: 2,
                                    objectFit: "cover",
                                    flexShrink: 0,
                                }}
                            />
                        ) : (
                            <Box
                                sx={{
                                    width: 110,
                                    height: 130,
                                    borderRadius: 2,
                                    border: "1px dashed",
                                    borderColor: "divider",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 1,
                                    flexShrink: 0,
                                    bgcolor: "background.default",
                                }}
                            >
                                <PersonIcon sx={{ fontSize: 32, color: "text.disabled" }} />
                                <Typography variant="caption" color="text.disabled" textAlign="center" sx={{ px: 1 }}>
                                    Foto<br />Devrim Gül
                                </Typography>
                            </Box>
                        )}

                        {/* Info */}
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h5" fontWeight={800} gutterBottom>
                                Devrim Gül
                            </Typography>
                            <Typography variant="body2" color="error.main" fontWeight={600} sx={{ mb: 1.5 }}>
                                Inhaber & Kraftfahrzeugtechniker
                            </Typography>
                            <Divider sx={{ borderColor: "divider", mb: 1.5 }} />
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                                KFZ-Technik GDG ist Ihr vertrauensvoller Partner für alle Fragen rund ums Fahrzeug
                                in Leibnitz und Umgebung. Als qualifizierter Kraftfahrzeugtechniker stehe ich für
                                ehrliche Beratung, sorgfältige Arbeit und faire Preise – ganz ohne Überraschungen
                                auf der Rechnung.
                            </Typography>

                        </Box>
                    </Stack>
                </CardContent>
            </Card>

            {/* Standort & Erreichbarkeit */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Card variant="outlined" sx={{ bgcolor: "background.paper", borderColor: "divider", height: "100%" }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography
                                variant="overline"
                                color="error.main"
                                fontWeight={700}
                                sx={{ letterSpacing: 1.5, display: "block", mb: 1.5 }}
                            >
                                Standort
                            </Typography>
                            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                Grazer Straße 136
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                                8430 Leibnitz, Österreich<br />
                                Kostenlose Parkplätze direkt vor der Werkstatt.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Card variant="outlined" sx={{ bgcolor: "background.paper", borderColor: "divider", height: "100%" }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography
                                variant="overline"
                                color="error.main"
                                fontWeight={700}
                                sx={{ letterSpacing: 1.5, display: "block", mb: 1.5 }}
                            >
                                Erreichbarkeit
                            </Typography>
                            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                Mo – Fr, 08:00 – 17:00 Uhr
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                                <Link href="tel:+436641990371" underline="none" color="inherit">
                                    0664 1990371
                                </Link>
                                <br />
                                <Link href="mailto:kfztechnik.gdg@gmail.com" underline="none" color="inherit">
                                    kfztechnik.gdg@gmail.com
                                </Link>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Werte */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                {VALUES.map((v) => (
                    <Grid key={v.title} size={{ xs: 12, sm: 4 }}>
                        <Card variant="outlined" sx={{ bgcolor: "background.paper", borderColor: "divider", height: "100%" }}>
                            <CardContent sx={{ p: 3, textAlign: "center" }}>
                                <Box sx={{ mb: 1.5 }}>{v.icon}</Box>
                                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                    {v.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {v.desc}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

        </Container>
    );
}
