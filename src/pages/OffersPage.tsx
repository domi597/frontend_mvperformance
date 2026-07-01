import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { getOffersByActive, IOffer } from "../api/offers.ts";
import {Box, Button, Card, CardContent, Chip, Container, Divider, Skeleton, Stack, Typography,} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

function OfferCardSkeleton() {
    return (
        <Card variant="outlined" sx={{ bgcolor: "background.paper", borderColor: "divider" }}>
            <CardContent sx={{ p: 3 }}>
                <Skeleton variant="rounded" width={48} height={48} sx={{ borderRadius: 2, mb: 2 }} />
                <Skeleton variant="text" width="55%" height={28} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" height={16} />
                <Skeleton variant="text" width="60%" height={16} sx={{ mb: 2 }} />
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Skeleton variant="rounded" width={70} height={24} sx={{ borderRadius: 10 }} />
                    <Skeleton variant="rounded" width={90} height={24} sx={{ borderRadius: 10 }} />
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Skeleton variant="text" width={60} height={36} />
                    <Skeleton variant="text" width={70} height={20} />
                </Stack>
                <Skeleton variant="rounded" width="100%" height={38} sx={{ borderRadius: 1 }} />
            </CardContent>
        </Card>
    );
}

export default function OffersPage() {
    const [offers, setOffers] = useState<IOffer[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getOffersByActive(true)
            .then(setOffers)
            .catch(() => setOffers([]))
            .finally(() => setLoading(false));
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
                <Typography variant="caption" color="text.primary">Angebote</Typography>
            </Stack>

            {/* Heading */}
            <Typography
                variant="overline"
                color="error.main"
                fontWeight={700}
                sx={{ letterSpacing: 1.5, display: "block", mb: 1 }}
            >
                UNSERE PAKETE
            </Typography>
            <Typography variant="h4" fontWeight={800} gutterBottom>
                Aktuelle Angebote
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Kombinierte Leistungspakete — mehr Service, besserer Preis.
            </Typography>

            {/* Grid */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 2,
                }}
            >
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => <OfferCardSkeleton key={i} />)
                ) : offers.length === 0 ? (
                    <Box sx={{ gridColumn: "1 / -1", textAlign: "center", py: 6 }}>
                        <Typography color="text.secondary">
                            Derzeit sind keine Angebote verfügbar.
                        </Typography>
                    </Box>
                ) : (
                    offers.map(offer => (
                        <Card
                            key={offer.id}
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
                                {offer.icon && (
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
                                            src={`data:image/png;base64,${offer.icon}`}
                                            alt="icon"
                                            style={{ width: 28, height: 28, objectFit: "contain" }}
                                        />
                                    </Box>
                                )}

                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                    {offer.title}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                                    {offer.description}
                                </Typography>

                                {/* Service tags */}
                                <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mb: 2 }}>
                                    {offer.services.map(s => (
                                        <Chip
                                            key={s.id}
                                            label={s.title}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontSize: 11, borderColor: "divider", color: "text.secondary" }}
                                        />
                                    ))}
                                </Stack>

                                <Divider sx={{ mb: 2 }} />

                                {/* Price + Duration */}
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                    <Typography variant="h5" fontWeight={800} color="error.main">
                                        {offer.price} €
                                    </Typography>
                                    {offer.duration != null && offer.duration > 0 && (
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <AccessTimeIcon sx={{ fontSize: 14, color: "text.disabled" }} />
                                            <Typography variant="caption" color="text.disabled">
                                                {offer.duration} min
                                            </Typography>
                                        </Stack>
                                    )}
                                </Stack>

                                <Button
                                    component={RouterLink}
                                    to="/termin"
                                    state={{ offerId: offer.id }}
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