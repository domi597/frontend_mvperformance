import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { to: "/leistungen", label: "Leistungen" },
  { to: "/angebote", label: "Angebote" },
  { to: "/kontakt", label: "Kontakt" },
  { to: "/ueber-uns", label: "Über uns" },
];

export default function Navbar() {
  const navigate = useNavigate();

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
          {/* Logo */}
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

          {/* Nav Links */}
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

          {/* Anmelden */}
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

          {/* CTA */}
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
