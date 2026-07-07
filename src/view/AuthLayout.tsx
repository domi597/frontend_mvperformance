import { Outlet, Link as RouterLink, useLocation } from "react-router-dom";
import { Box, Container, Link, Paper, Typography } from "@mui/material";

export const AuthLayout = () => {
    const location = useLocation();
    const isRegister = location.pathname.startsWith("/registrieren");
    const cardMaxWidth = isRegister ? 720 : 560;

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
            <Box
                sx={{
                    height: 56,
                    borderBottom: 1,
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Link
                    component={RouterLink}
                    to="/"
                    underline="none"
                    sx={{
                        fontWeight: 800,
                        fontSize: 18,
                        color: "#fff",
                        transition: "opacity 0.15s ease-in-out",
                        "&:hover": { opacity: 0.7 },
                    }}
                >
                    <Box component="span" sx={{ color: "primary.main" }}>KFZ</Box>
                    -Technik GDG
                </Link>
            </Box>

            <Container
                maxWidth="md"
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 5,
                }}
            >
                <Paper
                    variant="outlined"
                    sx={{
                        width: "100%",
                        maxWidth: cardMaxWidth,
                        overflow: "hidden",
                        transition: "max-width 0.15s ease-in-out",
                    }}
                >
                    <Box sx={{ px: { xs: 3, sm: 4.5 }, pt: 3.5, pb: 3, borderBottom: 1, borderColor: "divider" }}>
                        <Typography variant="h6" fontWeight={700}>
                            Ihr Kundenkonto
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Schneller buchen, Termine verwalten
                        </Typography>
                    </Box>

                    <Box sx={{ px: { xs: 3, sm: 4.5 }, py: 3.5 }}>
                        <Outlet />
                    </Box>

                    <Box
                        sx={{
                            px: { xs: 3, sm: 4.5 },
                            py: 1.5,
                            borderTop: 1,
                            borderColor: "divider",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            &copy; {new Date().getFullYear()} KFZ-Technik GDG
                        </Typography>
                        <Link
                            component={RouterLink}
                            to="/"
                            underline="hover"
                            variant="caption"
                            sx={{ fontWeight: 600, color: "text.secondary" }}
                        >
                            Zur Startseite
                        </Link>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};
