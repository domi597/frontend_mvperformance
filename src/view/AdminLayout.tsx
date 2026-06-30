import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, Divider, Drawer, Toolbar, Typography } from "@mui/material";
import AdminNavbar from "../components/admin/AdminNavbar.tsx";

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
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                bgcolor: "background.default",
                ".light-mode &": {
                    bgcolor: "#f5f5f5"
                }
            }}
        >
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
                        color: "text.primary",
                        ".light-mode &": {
                            bgcolor: "#ffffff",
                            borderColor: "#e0e0e0",
                            color: "#111111",
                            "& .MuiTypography-root, & .MuiSvgIcon-root, & .MuiListItemText-root, & .MuiButtonBase-root": {
                                color: "#111111 !important"
                            }
                        }
                    },
                }}
            >
                <Toolbar>
                    <Typography
                        fontWeight={800}
                        fontSize={16}
                        onClick={() => navigate("/")}
                        sx={{
                            cursor: "pointer",
                            color: "text.primary",
                            transition: "opacity 0.15s ease-in-out",
                            "&:hover": { opacity: 0.7 },
                            ".light-mode &": { color: "#111111" }
                        }}
                    >
                        <Box component="span" sx={{ color: "primary.main" }}>KFZ-Technik</Box>
                        {" "}GDG
                    </Typography>
                </Toolbar>
                <Divider sx={{ ".light-mode &": { borderColor: "#e0e0e0" } }} />
                <AdminNavbar />
            </Drawer>

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Box
                    sx={{
                        px: 4,
                        py: 2,
                        borderBottom: 1,
                        borderColor: "divider",
                        bgcolor: "background.paper",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        ".light-mode &": {
                            bgcolor: "#ffffff",
                            borderColor: "#e0e0e0",
                        }
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ color: "text.primary", ".light-mode &": { color: "#111111" } }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", ".light-mode &": { color: "#666666" } }}
                    >
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