// Navbar.tsx
// Zeigt Logo, Navigation, und rechts entweder "Anmelden" oder
// "Hallo [Vorname]" wenn ein Kunde eingeloggt ist.
// Klick auf den Namen öffnet ein Dropdown-Menü. -N 27.03.2026

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import AuthService from "../service/AuthService";

const NAV_LINKS = [
  { to: "/leistungen", label: "Leistungen" },
  { to: "/angebote", label: "Angebote" },
  { to: "/kontakt", label: "Kontakt" },
  { to: "/ueber-uns", label: "Über uns" },
];

export default function Navbar() {
  const navigate = useNavigate();

  // Eingeloggten Kunden aus dem localStorage lesen -N 27.03.2026
  const kunde = AuthService.getKunde();

  // Anchor-Element für das Dropdown-Menü (null = geschlossen) -N 27.03.2026
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  // Menü öffnen wenn auf den Namen geklickt wird -N 27.03.2026
  const handleOpenMenu = (e: { currentTarget: HTMLElement }) => {
    setMenuAnchor(e.currentTarget);
  };

  // Menü schließen -N 27.03.2026
  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  // Ausloggen: Token löschen, zur Startseite weiterleiten -N 27.03.2026
  const handleLogout = () => {
    AuthService.logout();
    handleCloseMenu();
    navigate("/");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.default",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg" disableGutters>
        <Toolbar sx={{ gap: 1 }}>

          {/* Logo -N 27.03.2026 */}
          <Typography
            component={NavLink}
            to="/"
            sx={{
              fontWeight: 800,
              fontSize: 18,
              color: "#fff",
              textDecoration: "none",
              mr: 4,
            }}
          >
            <Box component="span" sx={{ color: "primary.main" }}>
              KFZ
            </Box>
            -Technik GDG
          </Typography>

          {/* Nav Links -N 27.03.2026 */}
          <Box sx={{ display: "flex", gap: 0.5, flex: 1 }}>
            {NAV_LINKS.map((link) => (
              <Button
                key={link.to}
                component={NavLink}
                to={link.to}
                size="small"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  fontSize: 14,
                  px: 1.5,
                  borderRadius: 1,
                  "&.active": {
                    color: "#fff",
                    bgcolor: "rgba(198,40,40,0.12)",
                  },
                  "&:hover": {
                    color: "#fff",
                    bgcolor: "rgba(198,40,40,0.08)",
                  },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          {/* Eingeloggt: "Hallo [Vorname]" Button mit Dropdown — sonst "Anmelden" -N 27.03.2026 */}
          {kunde ? (
            <>
              <Button
                size="small"
                onClick={handleOpenMenu}
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  fontSize: 14,
                  "&:hover": { color: "#fff" },
                }}
              >
                Hallo, {kunde.vorname}
              </Button>

              {/* Dropdown-Menü nach Klick auf den Namen -N 27.03.2026 */}
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleCloseMenu}
                slotProps={{
                  paper: {
                    sx: { minWidth: 180, mt: 1 },
                  },
                }}
              >
                {/* Admin-Link nur für Admins anzeigen -N 27.03.2026 */}
                {kunde.role === "ADMIN" && (
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      navigate("/admin");
                    }}
                  >
                    Admin-Bereich
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    handleCloseMenu();
                    navigate("/mein-konto");
                  }}
                >
                  Mein Konto
                </MenuItem>
                <Divider />
                {/* Abmelden löscht Token und leitet zur Startseite -N 27.03.2026 */}
                <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                  Abmelden
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={NavLink}
              to="/login"
              size="small"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
                fontSize: 14,
                "&.active": { color: "#fff" },
                "&:hover": { color: "#fff" },
              }}
            >
              Anmelden
            </Button>
          )}

          {/* CTA -N 27.03.2026 */}
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate("/termin")}
            sx={{ fontWeight: 600, fontSize: 14, px: 2.5 }}
          >
            Termin anfragen
          </Button>

        </Toolbar>
      </Container>
    </AppBar>
  );
}
