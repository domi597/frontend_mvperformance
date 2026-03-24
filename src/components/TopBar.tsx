import { Box, Link, Stack, Typography } from "@mui/material";
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
          <LocationOnIcon sx={{ fontSize: 14, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">
            Gaindorf an der Sulm 1, 8430 Leibnitz
          </Typography>
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
