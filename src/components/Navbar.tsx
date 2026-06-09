/**
 * @file Navbar.tsx
 * @description Sticky navigation bar with logo, nav links and user menu.
 * Shows "Hallo [first name]" with a dropdown when logged in, otherwise an "Anmelden" button.
 * @author N
 * @since 27.03.2026
 */

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

  const kunde = AuthService.getKunde();

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (e: { currentTarget: HTMLElement }) => {
    setMenuAnchor(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

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
                Hallo, {kunde.firstName}
              </Button>

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
                    navigate("/my-account");
                  }}
                >
                  Mein Konto
                </MenuItem>
                <Divider />
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
