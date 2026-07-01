/**
 * @description Top Bar over the Navbar shows all important things about the company
 */

import { Box, Link, Stack } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

export default function TopBar() {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        py: 0.6,
        px: 2,
      }}
    >
      <Stack
        direction="row"
        spacing={3}
        justifyContent="center"
        alignItems="center"
        sx={{ maxWidth: 1200, mx: "auto" }}
      >
        <Stack direction="row" spacing={0.6} alignItems="center">
          <LocationOnIcon sx={{fontSize: 14, color: "text.secondary"}}/>
          <Link variant="caption" color="text.secondary" underline="hover"
                href={"https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=/maps/place//data%3D!4m2!3m1!1s0x476fa58281e7208b:0x7583b1c7a9607fd8%3Fsa%3DX%26ved%3D1t:8290%26ictx%3D111&ved=2ahUKEwj1kOvV0KGUAxVhQf4FHUZoMaIQ4kB6BAgoEAM&usg=AOvVaw3-fnMzHRou0-MorBxHXpQ_"}>
            Grazer Str. 136, 8430 Leibnitz
          </Link>
        </Stack>

        <Stack direction="row" spacing={0.6} alignItems="center">
          <EmailIcon sx={{ fontSize: 14, color: "text.secondary" }} />
          <Link
            href="mailto:office@kfz-gdg.at"
            underline="hover"
            variant="caption"
            color="text.secondary"
          >
            office@kfz-gdg.at
          </Link>
        </Stack>

        <Stack direction="row" spacing={0.6} alignItems="center">
          <PhoneIcon sx={{ fontSize: 14, color: "text.secondary" }} />
          <Link
            href="tel:+4334528274"
            underline="hover"
            variant="caption"
            color="text.secondary"
          >
            +43 (0)3452 82741
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
}
