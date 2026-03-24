import { Outlet } from "react-router-dom";
import { Box, Divider, Drawer, Toolbar, Typography } from "@mui/material";

const SIDEBAR_WIDTH = 240;

export default function AdminLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
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
          <Typography fontWeight={800} fontSize={16}>
            <Box component="span" sx={{ color: "primary.main" }}>KFZ</Box>
            -Technik GDG
          </Typography>
        </Toolbar>
        <Divider />
        {/* Nav Links kommen in AdminSidebar component */}
      </Drawer>

      {/* Main */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
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
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Admin
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, p: 4 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
