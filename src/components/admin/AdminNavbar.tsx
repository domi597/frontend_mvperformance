import { NavLink, useLocation } from "react-router-dom";
import {Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Badge,} from "@mui/material";
import {LayoutDashboard, CalendarDays, Calendar, Tag, Wrench, Users, Settings,} from "lucide-react";
import { useNewAppointmentsCount } from "../../hooks/useNewAppointmentsCount.ts";

const systemItems = [
    { label: "Einstellungen", to: "/admin/einstellungen", icon: <Settings size={18} /> },
];

function NavSection({ items }: { items: { label: string; to: string; icon: React.ReactNode; end?: boolean; badge?: boolean }[] }) {
    const { pathname } = useLocation();

    return (
        <List dense disablePadding>
            {items.map((item) => {
                const isActive = item.end
                    ? pathname === item.to
                    : pathname.startsWith(item.to);

                return (
                    <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                            component={NavLink}
                            to={item.to}
                            sx={{
                                borderRadius: 1.5,
                                px: 1.5,
                                py: 0.9,
                                // Nutzt deine CSS-Variablen für perfekte Farbwechsel
                                color: isActive ? "var(--text)" : "var(--text-secondary)",
                                bgcolor: isActive ? "var(--accent-soft)" : "transparent",
                                transition: "all 0.15s ease-in-out",

                                // Steuert den speziellen Aktiven-Look im Light Mode (Text wird Rot/Accent)
                                ...(isActive && {
                                    "body.light-mode &": {
                                        color: "var(--accent, #e63232)",
                                    }
                                }),

                                "&:hover": {
                                    bgcolor: "var(--accent-soft)",
                                    color: "var(--text)",
                                    "body.light-mode &": {
                                        color: "var(--accent, #e63232)",
                                    }
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 32, color: "inherit" }}>
                                {item.badge ? (
                                    <Badge color="error" variant="dot">
                                        {item.icon}
                                    </Badge>
                                ) : (
                                    item.icon
                                )}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{
                                    fontSize: 13,
                                    fontWeight: isActive ? 600 : 400,
                                    letterSpacing: "0.01em"
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
}

export default function AdminNavbar() {
    const newCount = useNewAppointmentsCount();

    const navItems = [
        { label: "Dashboard",  to: "/admin",            icon: <LayoutDashboard size={18} />, end: true       },
        { label: "Termine",    to: "/admin/termine",    icon: <CalendarDays size={18} />,    badge: newCount > 0 },
        { label: "Kalender",   to: "/admin/kalender",   icon: <Calendar size={18} />         },
        { label: "Angebote",   to: "/admin/angebote",   icon: <Tag size={18} />              },
        { label: "Leistungen", to: "/admin/leistungen", icon: <Wrench size={18} />           },
        { label: "Kunden",     to: "/admin/kunden",     icon: <Users size={18} />            },
    ];

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", px: 1.5, py: 2 }}>
            <Box sx={{ mb: 1 }}>
                <Typography
                    variant="caption"
                    sx={{
                        px: 1.5,
                        color: "var(--text-secondary)",
                        opacity: 0.7,
                        fontWeight: 700,
                        fontSize: 11,
                        letterSpacing: "0.08em"
                    }}
                >
                    VERWALTUNG
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                    <NavSection items={navItems} />
                </Box>
            </Box>

            <Box sx={{ mt: "auto" }}>
                <Divider sx={{ mb: 1.5, borderColor: "var(--border)" }} />
                <Typography
                    variant="caption"
                    sx={{
                        px: 1.5,
                        color: "var(--text-secondary)",
                        opacity: 0.7,
                        fontWeight: 700,
                        fontSize: 11,
                        letterSpacing: "0.08em"
                    }}
                >
                    SYSTEM
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                    <NavSection items={systemItems} />
                </Box>
            </Box>
        </Box>
    );
}
