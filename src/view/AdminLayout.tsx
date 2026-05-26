import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, Divider, Drawer, Toolbar, Typography } from "@mui/material";
import AdminNavbar from "../components/AdminNavbar";

/**
 * Admin layout with a permanent sidebar and a dynamic page title.
 * @author Dominik Ranegger
 * @since 08.05.2026
 */
const SIDEBAR_WIDTH = 220;

const pageTitles: Record<string, string> = {
    "/admin":                 "Dashboard",
    "/admin/termine":         "Termine",
    "/admin/angebote":        "Angebote",
    "/admin/leistungen":      "Leistungen",
    "/admin/kunden":          "Kunden",
    "/admin/einstellungen":   "Einstellungen",
};

export default function AdminLayout() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const title = pageTitles[pathname] ?? "Admin";

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: SIDEBAR_WIDTH,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: SIDEBAR_WIDTH,
                        bgcolor: "background.paper",
                        borderRight: 1,
                        borderColor: "divider",
                    },
                }}
            >
                <Toolbar>
                    <Typography
                        fontWeight={800}
                        fontSize={16}
                        onClick={() => navigate("/")}
                        sx={{ cursor: "pointer" }}
                    >
                        <Box component="span" sx={{ color: "primary.main" }}>KFZ-Technik</Box>
                        {" "}GDG
                    </Typography>
                </Toolbar>
                <Divider />
                <AdminNavbar />
            </Drawer>

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Box
                    sx={{
                        px: 4,
                        py: 2,
                        borderBottom: 1,
                        borderColor: "divider",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography variant="h6" fontWeight={700}>
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Admin
                    </Typography>
                </Box>

                <Box sx={{ flex: 1, p: 4 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
