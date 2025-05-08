import React from "react";
import {
  Drawer,
  IconButton,
  Box,
  Typography,
  Divider,
  Toolbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function RightDrawer({
  open,
  onClose,
  title,
  children,
  width = 400,
}) {
  return (
    <Drawer
      anchor="right"
      variant="temporary"
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          onClose();
        }
      }}
      keepMounted
      slotProps={{
        paper: {
          sx: {
            width,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
      ModalProps={{
        keepMounted: true,
        disableEnforceFocus: true,
      }}
    >
      {/* Optional: offset AppBar height */}
      <Toolbar />

      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>{children}</Box>
    </Drawer>
  );
}
