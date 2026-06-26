import { Outlet, Link as RouterLink, useNavigate } from "react-router-dom";
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Chip,
    Container,
    Divider,
    Menu,
    MenuItem,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material";
import {
    AccountCircleOutlined,
    DirectionsCarOutlined,
    HomeOutlined,
    LogoutOutlined,
    NavigateNextOutlined,
} from "@mui/icons-material";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import AuthService from "../service/AuthService";
import Footer from "../components/Footer";

const ACCOUNT_NAV = [
    { to: "/my-account", label: "Übersicht", icon: <AccountCircleOutlined fontSize="small" /> },
    { to: "/termin", label: "Termin anfragen", icon: <DirectionsCarOutlined fontSize="small" /> },
];

export default function AccountLayout() {
    const navigate = useNavigate();
    const kunde = AuthService.getKunde();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    const initials = kunde
        ? `${kunde.firstName?.[0] ?? ""}${kunde.lastName?.[0] ?? ""}`.toUpperCase()
        : "?";

    const handleLogout = () => {
        AuthService.logout();
        setMenuAnchor(null);
        navigate("/");
    };

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>

            <AppBar position="sticky" elevation={0} sx={{ bgcolor: "background.default", borderBottom: 1, borderColor: "divider" }}>
                <Container maxWidth="lg" disableGutters>
                    <Toolbar sx={{ gap: 1 }}>

                        <Typography
                            component={NavLink}
                            to="/"
                            sx={{ fontWeight: 800, fontSize: 18, color: "text.primary", textDecoration: "none", mr: 3 }}
                        >
                            <Box component="span" sx={{ color: "primary.main" }}>KFZ</Box>
                            -Technik GDG
                        </Typography>

                        <Box sx={{ display: "flex", gap: 0.5, flex: 1 }}>
                            {ACCOUNT_NAV.map((link) => (
                                <Button
                                    key={link.to}
                                    component={NavLink}
                                    to={link.to}
                                    size="small"
                                    startIcon={link.icon}
                                    end
                                    sx={{
                                        color: "text.secondary",
                                        fontWeight: 500,
                                        fontSize: 13,
                                        px: 1.5,
                                        borderRadius: 1,
                                        "&.active": { color: "text.primary", bgcolor: "rgba(198,40,40,0.12)" },
                                        "&:hover": { color: "text.primary", bgcolor: "rgba(198,40,40,0.08)" },
                                    }}
                                >
                                    {link.label}
                                </Button>
                            ))}
                        </Box>

                        <Button
                            component={NavLink}
                            to="/"
                            size="small"
                            startIcon={<HomeOutlined fontSize="small" />}
                            sx={{ color: "text.secondary", fontSize: 13, mr: 1, "&:hover": { color: "text.primary" } }}
                        >
                            Zur Website
                        </Button>

                        <Avatar
                            onClick={(e) => setMenuAnchor(e.currentTarget)}
                            sx={{
                                width: 34,
                                height: 34,
                                bgcolor: "primary.main",
                                fontSize: 13,
                                fontWeight: 700,
                                cursor: "pointer",
                                "&:hover": { bgcolor: "primary.dark" },
                                transition: "background 0.15s",
                            }}
                        >
                            {initials}
                        </Avatar>

                        <Menu
                            anchorEl={menuAnchor}
                            open={Boolean(menuAnchor)}
                            onClose={() => setMenuAnchor(null)}
                            slotProps={{ paper: { sx: { minWidth: 200, mt: 1, borderRadius: 2 } } }}
                        >
                            <Box sx={{ px: 2, py: 1.5 }}>
                                <Typography variant="body2" fontWeight={700}>
                                    {kunde?.firstName} {kunde?.lastName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">{kunde?.email}</Typography>
                            </Box>
                            <Divider />
                            <MenuItem onClick={() => { setMenuAnchor(null); navigate("/my-account"); }} sx={{ gap: 1.5, fontSize: 14 }}>
                                <AccountCircleOutlined fontSize="small" sx={{ color: "text.secondary" }} />
                                Mein Konto
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout} sx={{ gap: 1.5, fontSize: 14, color: "error.main" }}>
                                <LogoutOutlined fontSize="small" />
                                Abmelden
                            </MenuItem>
                        </Menu>

                    </Toolbar>
                </Container>
            </AppBar>

            <Box
                sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    py: 3,
                }}
            >
                <Container maxWidth="lg">
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1, color: "text.secondary" }}>
                        <Typography
                            component={RouterLink}
                            to="/"
                            variant="caption"
                            sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "primary.main" } }}
                        >
                            Startseite
                        </Typography>
                        <NavigateNextOutlined sx={{ fontSize: 14 }} />
                        <Typography variant="caption" color="text.primary">Mein Konto</Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ width: 48, height: 48, bgcolor: "primary.main", fontSize: 18, fontWeight: 700 }}>
                            {initials}
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight={700}>
                                {kunde?.firstName} {kunde?.lastName}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="caption" color="text.secondary">{kunde?.email}</Typography>
                                {kunde?.role === "ADMIN" && (
                                    <Chip label="Admin" size="small" color="primary" sx={{ fontSize: 10, height: 18 }} />
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                </Container>
            </Box>

            <Box component="main" sx={{ flex: 1 }}>
                <Outlet />
            </Box>

            <Footer />
        </Box>
    );
}
