import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { getServices, IService } from "../api/services";
import {Box, Button, Card, CardContent, Container, Divider, Skeleton, Stack, Typography,} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

function ServiceCardSkeleton() {
    return (
        <Card variant="outlined" sx={{ bgcolor: "background.paper", borderColor: "divider" }}>
            <CardContent sx={{ p: 3 }}>
                <Skeleton variant="rounded" width={48} height={48} sx={{ borderRadius: 2, mb: 2 }} />
                <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="85%" height={16} />
                <Skeleton variant="text" width="55%" height={16} sx={{ mb: 2 }} />
                <Divider sx={{ mb: 2 }} />
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Skeleton variant="text" width={60} height={32} />
                    <Skeleton variant="text" width={70} height={20} />
                </Stack>
                <Skeleton variant="rounded" width="100%" height={38} sx={{ borderRadius: 1 }} />
            </CardContent>
        </Card>
    );
}

export default function ServicesPage() {
    const [services, setServices] = useState<IService[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            setIsLoading(true);
            try {
                const data = await getServices();
                setServices(data);
            } catch (err) {
                console.log("ServicePage.tsx : " + err);
                setServices([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchServices();
    }, []);

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
                <Typography variant="caption" color="text.primary">Leistungen</Typography>
            </Stack>

            {/* Heading */}
            <Typography
                variant="overline"
                color="error.main"
                fontWeight={700}
                sx={{ letterSpacing: 1.5, display: "block", mb: 1 }}
            >
                WAS WIR ANBIETEN
            </Typography>
            <Typography variant="h4" fontWeight={800} gutterBottom>
                Unsere Leistungen
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Professionelle KFZ-Arbeiten — schnell, transparent und zu fairen Preisen.
            </Typography>

            {/* Grid */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 2,
                }}
            >
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => <ServiceCardSkeleton key={i} />)
                ) : services.length === 0 ? (
                    <Box sx={{ gridColumn: "1 / -1", textAlign: "center", py: 6 }}>
                        <Typography color="text.secondary">
                            Aktuell sind keine Leistungen verfügbar.
                        </Typography>
                    </Box>
                ) : (
                    services.map((value) => (
                        <Card
                            key={value.id}
                            variant="outlined"
                            sx={{
                                bgcolor: "background.paper",
                                borderColor: "divider",
                                display: "flex",
                                flexDirection: "column",
                                transition: "border-color 0.2s, transform 0.2s",
                                "&:hover": {
                                    borderColor: "error.main",
                                    transform: "translateY(-3px)",
                                },
                            }}
                        >
                            <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", flex: 1 }}>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        bgcolor: "action.hover",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mb: 2,
                                    }}
                                >
                                    <img
                                        src={`data:image/png;base64,${value.icon}`}
                                        alt="icon"
                                        style={{ width: 28, height: 28, objectFit: "contain" }}
                                    />
                                </Box>

                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                    {value.title}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                                    {value.subtitle}
                                </Typography>

                                <Divider sx={{ mb: 2 }} />

                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                    <Typography variant="h5" fontWeight={800} color="text.primary">
                                        {value.price} €
                                    </Typography>
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                        <AccessTimeIcon sx={{ fontSize: 14, color: "text.disabled" }} />
                                        <Typography variant="caption" color="text.disabled">
                                            {value.duration} min
                                        </Typography>
                                    </Stack>
                                </Stack>

                                <Button
                                    component={RouterLink}
                                    to="/termin"
                                    state={{ serviceId: value.id }}
                                    variant="contained"
                                    color="error"
                                    fullWidth
                                    sx={{ fontWeight: 700, letterSpacing: 0.5, mt: "auto" }}
                                >
                                    Termin anfragen
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>
        </Container>
    );
}